import time
from datetime import datetime
import pymongo

south_america = ['Argentina', 'Bolivia', 'Brazil','Colombia', 'Ecuador', 'Peru', 'Chile','Guyana', 'Paraguay', 'Suriname', 'Uruguay', 'Venezuela', 'French Guiana', 'Puerto Rico', 'Papua New Guinea', 'U.S. Virgin Islands', 'Dominican Republic', 'British Virgin Islands']
asia = ['Indonesia', 'India', 'Pakistan', 'Afghanistan', 'Japan', 'Japan Region', 'Russia', 'offshore Azerbaijan', 'Azerbaijan', 'Philippines', 'Burma', 'Myanmar', 'China', 'Taiwan','Kyrgyzstan', 'East Timor', 'Northern Mariana Islands', 'Micronesia', 'Solomon Islands']
north_america = ['CA', 'Alaska', 'Hawaii', 'Nevada', 'California', 'Montana', 'Washington', 'United States', 'Oklahoma', 'Tennessee', 'Utah', 'Canada', 'Kansas', 'Nicaragua', 'Missouri', 'Mexico', 'MX', 'Wyoming', 'Oregon', 'Idaho', 'Colorado', 'Arizona']
anz = ['Fiji', 'Australia', 'Vanuatu', 'New Caledonia', 'New Zealand', 'Tonga']

conn = 'mongodb://localhost:27017'
# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)
db = client.raw_data
filter_response = db.filter_response

def trim_response(res):
    all_events = []
    tsunami_triggered_count = 0
    tsunami_not_triggered_count = 0
    timeseries_data = {}
    if (res is not None):
        for feature in res["features"]:
            event = generate_event(feature)

            if (event["tsunami"] == 1):
                tsunami_triggered_count = tsunami_triggered_count + 1
            else:
                tsunami_not_triggered_count = tsunami_not_triggered_count + 1
            
            # prepare dictionary for date and number of earthquakes
            dt = event["formatted_only_date"]
            if dt  in timeseries_data:
                count = timeseries_data[dt]
                timeseries_data[dt] = count+1
            else:
                timeseries_data[dt] = 1
            all_events.append(event)
            save_event(event)
            event.pop("_id", None)
    else:
        print("Response is empty") 
    
    complete_data = {
        "count" : len(all_events),
        "all_events" : all_events,
        "tsunami_warning_count" : {
            "tsunami_warning" : tsunami_triggered_count, 
            "no_tsunami_warning" : tsunami_not_triggered_count
        },
        "timeseries_data" : timeseries_data
    }
    #print(complete_data)
    return complete_data

def get_region(place):
    tokens = place.split(',')
    if (len(tokens) > 1):
        location = tokens[len(tokens)-1].strip()
    else:
        location = tokens[0].strip()

    return find_region_for_entity(location)

def find_region_for_entity(location):
    if location in north_america:
        return "North America"
    elif location in south_america:
        return "South America"
    elif location in asia:
        return "Asia"
    elif location in anz:
        return "ANZ"
    else:
        return "Other"

def save_event(e):
    filter_response.insert_one(e)

def generate_event(data):
    tsunami_event = data["properties"]["tsunami"]
    ts = data["properties"]["time"]
    formatted_date = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(ts/1000))
    only_date = time.strftime('%Y-%m-%d', time.gmtime(ts/1000))
    geo_location = data["properties"]["place"]
    #print(ts)
    #print(time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(ts/1000)))
    event_dict = {
        "date" : data["properties"]["time"],
        "formatted_date" : formatted_date,
        "formatted_only_date" : only_date,
        "location" : data["geometry"]["coordinates"],
        "magnitude" : data["properties"]["mag"],
        "significance" : data["properties"]["sig"],
        "tsunami" : tsunami_event,
        "place" : geo_location,
        "region" : get_region(geo_location)
    }

    return event_dict