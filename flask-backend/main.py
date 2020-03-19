from flask import Flask, jsonify, request
import flask
import copy
import secrets
app = Flask('app')

class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

# since flask_api's status doesn't work, here's an error handler
@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.route('/', methods=['GET'])
def hello_world():
  return "Api test"

accounts = [
  {
    "phone_number": 123,
    "password": "animeisforweebs"
  }
]

@app.route('/api/sign_up', methods=['POST'])
def sign_up():
  message = ""
  sign_up_req = dict(request.form)
  if "phone_number" in sign_up_req and "password" in sign_up_req:
    user_id = int(sign_up_req['phone_number'])
    user_password = (sign_up_req['password'])
  else:
    raise InvalidUsage('Invalid Format', status_code=400)
  #You need longer password boomer.
  if len(user_password) < 8:
    message = "Your password is too short."
    raise InvalidUsage('Password too short', status_code=400)

  #Checks if the phone number is in the database.
  alreadyExist = False
  for account in accounts:
    if account['phone_number'] == user_id:
      alreadyExist = True
      raise InvalidUsage('Account already exists', status_code=400)

  #Add credentials if the phone number is unique.
  if alreadyExist is not True:
    accounts.append({'phone_number':user_id, 'password': user_password})
    message = "Account successfully created"
  
  return message

# A route to return all of the available entries in our catalog.
# @app.route('/api/v1/resources/values/all', methods=['GET'])
# def api_all():
#   return jsonify(return_value)

@app.route('/api/login', methods=['POST'])
def sign_in():
  login_request = dict(request.form)
  if 'phone_number' in login_request and 'password' in login_request:
    value_id = int(login_request['phone_number'])
    value_key = login_request['password']
  else:
    raise InvalidUsage("There isn't a phone number in that request!", status_code=409)

  result = []
  # Loop through the data and match results that fit the requested ID.
  # IDs are unique, but other fields might return many results
  for value in accounts:
      if value['phone_number'] == value_id:
        if value['password'] == value_key:
            # since value is actually a reference, we deepcopy it as so not to actually affect the point in accounts
            return_value = copy.deepcopy(value)
            # note this just generates a session id, without checking if that session id already exists, but the chances of there being two same session ids is mathematically microscophic so idc fuck you
            return_value["session_id"] = secrets.token_hex(16)
            result.append(return_value)
            result.append("Here is your account data!")
        else:
          raise InvalidUsage('Incorrect password', status_code=409)
  
  return jsonify(result)

# this is needed to host the flask server under repl.it
app.run(host='0.0.0.0', port=8080)