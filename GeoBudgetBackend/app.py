from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  
from openai import OpenAI
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from datetime import datetime
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
import os


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY")
client = OpenAI(api_key=OPENAI_KEY)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://xoinxwkw:hBoC6ANnU0gYxxfYIjtajR58cHAkiWpE@berry.db.elephantsql.com/xoinxwkw'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    expenses = db.relationship('Expense', backref='user', lazy=True)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)  # Primary key column
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    date = db.Column(db.String(255), nullable=False)  # Name column, cannot be null
    name = db.Column(db.String(255), nullable=False)  # Name column, cannot be null
    amount = db.Column(db.Float, nullable=False)  # Amount column, cannot be null
    description = db.Column(db.String(255), nullable=True)  # Description column, can be null
    lat = db.Column(db.Float, nullable=False)  # lat cannot be null
    lng = db.Column(db.Float, nullable=False)  # lng cannot be null


def convert_demoinfo_to_str(expenses):
    result_str = "[\n"
    for obj in expenses:
        # Add $ to the amount, lat to latitude, and lng to longitude
        obj_str = f"{{\"cost\": ${obj['amount']}, \"date\": \"{obj['date']}\",\"expense name\": \"{obj['name']}\"}}"
        result_str += "    " + obj_str + ",\n"

    # Remove the trailing comma from the last line
    result_str = result_str.rstrip(",\n") + "\n]"

    return result_str


@app.route('/addexpenses', methods=['POST'])
def addexpenses():
     
    try:
        data = request.get_json()
        email = data['email']
        user = User.query.filter_by(email=email).first()
    
        
        if user is None:
            new_user = User(email=email)
            db.session.add(new_user)
            db.session.commit()
            user = new_user
  
        new_expense = Expense(user_id = user.user_id, date=data['date'], name=data['name'], amount=data['amount'], description=data.get('description'), lat=data['lat'], lng=data['lng'])
        print(new_expense)
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({'message': 'Expense added successfully'})
    
    except Exception as e:
        # Log the error or handle it appropriately
        return jsonify({'error': f'Failed to fetch expenses: {str(e)}'}), 500



@app.route('/getexpenses', methods=['POST'])
def getexpenses():
    try:
        email = request.json.get('email')
        user = User.query.filter_by(email=email).first()
        
        if user is None:
            new_user = User(email=email)
            db.session.add(new_user)
            db.session.commit()
            user = new_user

        expenses = Expense.query.filter_by(user_id=user.user_id).all()

        if user is not None and len(expenses) == 0:
            return jsonify([])
        else:
            return jsonify([{'id': expense.id, 'date': expense.date, 'name': expense.name, 'amount': expense.amount, 'description': expense.description, 'lat': expense.lat, 'lng': expense.lng} for expense in expenses])
    
    except Exception as e:
        # Log the error or handle it appropriately
        return jsonify({'error': f'Failed to fetch expenses: {str(e)}'}), 500

@app.route('/expenses/<int:expense_id>', methods=['DELETE', 'OPTIONS'])
def delete_expense(expense_id):
    if request.method == 'OPTIONS':
        # Respond to the preflight OPTIONS request
        response = jsonify()
    else:
        # Handle the DELETE request
        expense = db.session.get(Expense, expense_id)
        if expense:
            db.session.delete(expense)
            db.session.commit()
            response = jsonify({'message': 'Expense deleted successfully'})
        else:
            response = jsonify({'error': 'Expense not found'})

    return response



@app.route('/generate_prompt', methods=['POST'])
def generate_prompt():
    try:
        # Get the prompt from the request JSON
        user_prompt = request.json.get('prompt').get('content')
        chatHistory = request.json.get('history')
        expenses = request.json.get('expenses')
        
        print(expenses)

        llm = ChatOpenAI(openai_api_key=OPENAI_KEY)

        embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_KEY)

        text_splitter = RecursiveCharacterTextSplitter()

        currentdate=datetime.now().strftime("%Y-%m-%d")

        expensesstr = "{" + currentdate + "}" + convert_demoinfo_to_str(expenses)
        splitdata = text_splitter.split_text(expensesstr)
        vector = FAISS.from_texts(splitdata, embeddings)

        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are FinanceAI, a helpful assistant. Concisely answer the following question based on the provided context which is a list of the user's expenses. Do not answer if user is off-topic. :\n\n{context}"),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
        ])

        document_chain = create_stuff_documents_chain(llm, prompt)

        retriever = vector.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        transformedchatHistory=[]
        for obj in chatHistory:
            if obj.get('role') == 'user':
                transformedchatHistory.append(HumanMessage(content=obj.get('content')))
            elif obj.get('role') == 'assistant':
                transformedchatHistory.append(AIMessage(content=obj.get('content')))

        response = retrieval_chain.invoke({"chat_history": transformedchatHistory, "input": user_prompt})

        return response["answer"]
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return "Hosted!"

#This block ensures that the database is created and tables are defined
#The key change is the addition of the with app.app_context(): block around the db.create_all() statement. This ensures that the database operations are executed within the context of the Flask application.
with app.app_context():
    db.create_all()

# Run the Flask application if this script is executed
if __name__ == '__main__':
    app.run()