# Import necessary modules and classes from Flask
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS from flask_cors

# Create a Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the database URI. In this case, using SQLite and a file named 'expenses.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'

# Create a SQLAlchemy instance and associate it with the Flask app
db = SQLAlchemy(app)

# Define a model for the 'Expense' table in the database
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Primary key column
    date = db.Column(db.String(255), nullable=False)  # Name column, cannot be null
    name = db.Column(db.String(255), nullable=False)  # Name column, cannot be null
    amount = db.Column(db.Float, nullable=False)  # Amount column, cannot be null
    description = db.Column(db.String(255), nullable=True)  # Description column, can be null
    lat = db.Column(db.Float, nullable=True)  # lat can be null
    lng = db.Column(db.Float, nullable=True)  # lng can be null

# Define a route for the '/expenses' URL with support for GET and POST methods
@app.route('/expenses', methods=['GET', 'POST'])
def expenses():
    # If the request method is GET, retrieve all expenses from the database
    if request.method == 'GET':
        expenses = Expense.query.all()
        # Return a JSON response containing information about each expense
        return jsonify([{'id': expense.id, 'date': expense.date, 'name': expense.name, 'amount' : expense.amount, 'description' : expense.description} for expense in expenses])
    
    # If the request method is POST, add a new expense to the database
    elif request.method == 'POST':
        # Extract JSON data from the request
        data = request.get_json()
        # Create a new 'Expense' object using the data
        new_expense = Expense(date=data['date'], name=data['name'], amount=data['amount'], description=data.get('description'), lat=data.get('lat'), lng=data.get('lng'))
        # Add the new expense to the database session
        db.session.add(new_expense)
        # Commit the changes to the database
        db.session.commit()
        # Return a JSON response indicating the success of the operation
        return jsonify({'message': 'Expense added successfully'})

@app.route('/expenses/<int:expense_id>', methods=['DELETE', 'OPTIONS'])
def delete_expense(expense_id):
    if request.method == 'OPTIONS':
        # Respond to the preflight OPTIONS request
        response = jsonify()
    else:
        # Handle the DELETE request
        expense = Expense.query.get(expense_id)
        if expense:
            db.session.delete(expense)
            db.session.commit()
            response = jsonify({'message': 'Expense deleted successfully'})
        else:
            response = jsonify({'error': 'Expense not found'})

    return response

#This block ensures that the database is created and tables are defined
#The key change is the addition of the with app.app_context(): block around the db.create_all() statement. This ensures that the database operations are executed within the context of the Flask application.
with app.app_context():
    db.create_all()

# Run the Flask application if this script is executed
if __name__ == '__main__':
    app.run(debug=True)