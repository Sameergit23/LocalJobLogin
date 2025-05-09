from flask import Flask, request, render_template, jsonify, send_from_directory
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config["MONGO_URI"] = "mongodb://localhost:27017/userDB"
mongo = PyMongo(app)

# Serve CSS/JS
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

# Home
@app.route('/')
def home():
    return render_template("index.html")



# Register
@app.route('/register', methods=['POST'])
def register():
    role    = request.form.get('role')
    name    = request.form.get('name')
    mobile  = request.form.get('mobile')
    password= request.form.get('password')

    if not role or not name or not mobile or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    # Check duplicate
    if mongo.db.users.find_one({'mobile': mobile, 'role': role}):
        return jsonify({'error': 'User already exists'}), 409

    # Role-specific
    user_doc = {
        'role': role, 'name': name,
        'mobile': mobile,
        'password': password
    }

    if role == 'labour':
        age    = request.form.get('age')
        family = request.form.get('family')
        gender = request.form.get('gender')
        if not age or not family or not gender:
            return jsonify({'error': 'Missing labour fields'}), 400
        user_doc.update({'age': int(age), 'family': int(family), 'gender': gender})
    else:
        address = request.form.get('address')
        if not address:
            return jsonify({'error': 'Missing contractor address'}), 400
        user_doc['address'] = address

    mongo.db.users.insert_one(user_doc)
    return jsonify({'message': f'{role.title()} registered successfully'}), 201

# Login
@app.route('/login', methods=['POST'])
def login():
    role     = request.form.get('role')
    mobile   = request.form.get('mobile')
    password = request.form.get('password')

    if not role or not mobile or not password:
        return jsonify({'error': 'Missing login credentials'}), 400

    user = mongo.db.users.find_one({'mobile': mobile, 'role': role})
    if not user or user['password'] != password:
        return jsonify({'error': 'Invalid number or password'}),401
    return jsonify({
        'message': f'{role.title()} login successful',
        'user': {'role': user['role'], 'name': user['name'], 'mobile': user['mobile']}
    }), 200

if __name__ == '__main__':







    app.run(debug=True)