import time
from datetime import datetime

def trim_response(res):
    all_events = []
    tsunami_triggered_count = 0
    tsunami_not_triggered_count = 0
    timeseries_data = {}
    if (res is not None):
        for feature in res["features"]:
            tsunami_event = feature["properties"]["tsunami"]
            ts = feature["properties"]["time"]
            formatted_date = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(ts/1000))
            only_date = time.strftime('%Y-%m-%d', time.gmtime(ts/1000))
            #print(ts)
            #print(time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(ts/1000)))
            event = {
                "date" : feature["properties"]["time"],
                "formatted_date" : formatted_date,
                "formattes_only_date" : only_date,
                "location" : feature["geometry"]["coordinates"],
                "magnitude" : feature["properties"]["mag"],
                "significance" : feature["properties"]["sig"],
                "tsunami" : tsunami_event,
                "place" : feature["properties"]["place"]
            }

            if (tsunami_event == 1):
                tsunami_triggered_count = tsunami_triggered_count + 1
            else:
                tsunami_not_triggered_count = tsunami_not_triggered_count + 1
            
            # prepare dictionary for date and number of earthquakes
            if only_date  in timeseries_data:
                count = timeseries_data[only_date]
                timeseries_data[only_date] = count+1
            else:
                timeseries_data[only_date] = 1
            all_events.append(event)
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
    return complete_data