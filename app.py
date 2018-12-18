from flask import Flask, render_template, redirect, jsonify
# import mongo lib
import pymongo
import requests
import json
from process_response import trim_response
import pprint
from bson.json_util import dumps

# Flask Setup
app = Flask(__name__)

#mongodb setup
conn = 'mongodb://localhost:27017'
# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)
db = client.raw_data
collection = db.all_month
processed_collection = db.custom_response
filter_response = db.filter_response


#home route
@app.route("/")
def index():
	response_data = None
	try:
		response = requests.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").json()
		#collection.drop()
		collection.insert_one(response)
		filter_response.drop()
		response_data = trim_response(response, 1)
		processed_collection.drop()
		processed_collection.insert_one(trim_response(response, 0))
	except Exception as e:
		print(e)

	return jsonify(response_data)

@app.route("/filter/<date>")
@app.route("/filter/<date>/<region>")
@app.route("/filter/<date>/<region>/<tw>")
@app.route("/filter/<date>/<region>/<tw>/<mag>")
# when data is not filtered on date, api call /filter/0 or /filter
# default value for filters when not used - 
#	date = 0
#	region = any
#	tw = -1 (Stands for tsunami warning)
#	mag = skip (stands for magnitude)
def user_filter(date=None, region=None, tw=None, mag=None):
	user_fi = {}
	if (date is not None and date != '0'):
		user_fi['formatted_only_date'] = str(date)
	if (region is not None and region != 'any'):
		user_fi['region'] = str(region)
	if (tw is not None and tw != '-1'):
		user_fi['tsunami'] = int(tw)
	if (mag is not None):
		inner_condition = {'$gt' : float(mag)}
		user_fi['magnitude'] = inner_condition
	
	print(user_fi)
	if (user_fi is not None):
		res = filter_response.find(user_fi)
		print(filter_response.count_documents(user_fi))
	else:
		res = filter_response.find()
	
	return dumps(res)

if __name__ == "__main__":
    app.run(debug=True)