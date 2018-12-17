from flask import Flask, render_template, redirect, jsonify
# import mongo lib
import pymongo
import requests
import json
from process_response import trim_response
import pprint

# Flask Setup
app = Flask(__name__)

#mongodb setup
conn = 'mongodb://localhost:27017'
# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)
db = client.raw_data
collection = db.all_month
collection.drop()
processed_collection = db.custom_response
@app.route("/")
def index():
	response_data = None
	try:
		response = requests.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").json()
		collection.insert_one(response)
		response_data = trim_response(response)
		db.custom_response.insert_one(trim_response(response))
	except Exception as e:
		print(e)

	return jsonify(response_data)

@app.route("/geo-mapping")
def mapping():
	try:
		#geolocator = Nominatim(user_agent="ucb-da")
		response = requests.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").json()
		#print(response)
		features = response["features"]
		for feature in features:
			#print(feature)
			location = feature["geometry"]["coordinates"]
			#g = geocoder.google([location[1], location[2]], method='reverse')
			#print(g)
			#locationDetails = geolocator.reverse(location[1], location[0])
			#print(locationDetails)
			#print(location[1])
			mapurl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng={},{}&key=YOUR_KEY'.format(location[1], location[0])
			#print(mapurl)
			mapres = requests.get(mapurl).json()
			#print(mapres)
			#components = mapres['results'][0]['address_components']
			#for c in components:
				#if "country" in c['types']:
					#country = c['long_name']
					#print(country)
				#if "postal_town" in c['types']:
					#town = c['long_name']
					#print(town)
		#latest_data = db.allcountries
	except Exception as e:
		print(e)

	return ""

if __name__ == "__main__":
    app.run(debug=True)