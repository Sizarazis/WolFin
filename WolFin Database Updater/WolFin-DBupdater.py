#imports
from selenium import webdriver
from bs4 import BeautifulSoup
from datetime import datetime
import json

driver = webdriver.Chrome("chromedriver")


#Special thanks to eoddata.com and finance.yahoo.com, because I'm crawling their stuff

# Get all stock symbols
symbols = {}
symIndex = 0

letter = 90 #real start at 65
while letter < 91:
    driver.get("http://eoddata.com/stocklist/NYSE/" + chr(letter) + ".html")
    content = driver.page_source
    soup = BeautifulSoup(content, features="html.parser")

    soup.select("td > a")
    for tag in soup.findAll('a', href=True):
        try:
            if tag['title']:
                if tag['title'].find("Display Quote") != -1:
                    symbols[symIndex] = tag.contents[0]
                    symIndex = symIndex + 1
        except:
            continue

    letter = letter + 1


#Get historical stock data
startDate = "1259913600"  #in epochs (2009-12-04)
endDate = "1575446400"    #in epochs (2019-12-04)
instances = []
json_out = {}

for key in symbols:
    driver.get("https://finance.yahoo.com/quote/" + symbols[key] + "/history?period1=" + startDate + "&period2=" + endDate + "&interval=1d&filter=history&frequency=1d")
    content = driver.page_source
    soup = BeautifulSoup(content, features="html.parser").prettify().splitlines()

    #Get one stock's historical data
    history = ""
    for line in soup:
        if line.__contains__("root.App.main"):
            try:
                history = line
                history = line.split("\"HistoricalPriceStore\":{\"prices\":[", 1)[1]
                history = history.rsplit("],\"isPending\"", 1)[0]
                break
            except:
                continue
    dump = history.split("}")

    #Format the stock's historical data for a JSON file
    entry = {}
    start = ""
    target = []
    dynamic_feat = []
    for ptr in range(0, len(dump)-1):
        try:
            if ptr == 0:
                start = str(datetime.fromtimestamp(int(dump[ptr].split("\"date\":")[1].split(",")[0])))

            vol = dump[ptr].split("\"volume\":")[1].split(",")[0]
            eod = dump[ptr].split("\"adjclose\":")[1].split("]")[0]

            target.append(float(eod))
            dynamic_feat.append(int(vol))
        except:
            target.append(None)
            dynamic_feat.append(None)
            continue

    entry["start"] = start
    entry["target"] = target
    entry["dynamic_feat"] = dynamic_feat
    instances.append(entry)

json_out["instances"] = instances
json_string = json.dumps(json_out)

#TODO: Export JSON file
with open('wolfin-historical.txt', 'w') as outfile:
    json.dump(json_string, outfile)
