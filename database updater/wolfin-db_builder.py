# imports
from selenium import webdriver
from bs4 import BeautifulSoup
from datetime import datetime

driver = webdriver.Chrome("chromedriver")


# Special thanks to eoddata.com and finance.yahoo.com, because I'm crawling their stuff


# Get all stock symbols
symbols = {}
symIndex = 0

letter = 90     # real start at 65
while letter < 91:
    driver.get("http://eoddata.com/stocklist/NYSE/" + chr(letter) + ".html")
    content = driver.page_source
    soup = BeautifulSoup(content, features="html.parser")

    soup.select("td > a")
    for tag in soup.find_all('a', href=True):
        try:
            if tag.has_attr('title'):
                if tag['title'].__contains__("Display Quote"):
                    if len(tag.contents) > 0:
                        symbols[symIndex] = tag.contents[0]
                        symIndex = symIndex + 1
            continue
        except Exception as e:
            print("Exception in getting the stock symbols: " + str(e))
            continue

    letter = letter + 1


# Get historical stock data
startDate = "1259913600"  # in epochs (2009-12-04)
endDate = "1575446400"    # in epochs (2019-12-04)
entries = []

# Crawl through all of the stock symbols
for key in symbols:
    driver.get("https://finance.yahoo.com/quote/" + symbols[key] + "/history?period1=" + startDate + "&period2=" + endDate + "&interval=1d&filter=history&frequency=1d")
    content = driver.page_source
    soup = BeautifulSoup(content, features="html.parser").prettify().splitlines()

    # Get one stock's historical data
    history = ""
    badPath = False
    for line in soup:
        if line.__contains__("root.App.main"):
            if line.__contains__("\"currentPageName\":\"lookup\""):
                badPath = True
                break
            try:
                history = line
                history = line.split("\"HistoricalPriceStore\":{\"prices\":[", 1)[1]
                history = history.rsplit("],\"isPending\"", 1)[0]
                break
            except Exception as e:
                print("Exception in getting a stock's historical data: " + str(e))
                continue
    if badPath:
        continue
    dump = history.split("}")

    # Format the stock's historical data for a JSON file
    entry = {}
    start = ""
    target = []
    dynamic_feat = [1]
    vols = []
    for ptr in range(0, len(dump)-1):
        try:
            if ptr == 0:
                start = str(datetime.fromtimestamp(int(dump[ptr].split("\"date\":")[1].split(",")[0])))

            if dump[ptr].__contains__("volume") and dump[ptr].__contains__("adjclose"):
                vol = dump[ptr].split("\"volume\":")[1].split(",")[0]
                eod = dump[ptr].split("\"adjclose\":")[1].split("]")[0]

            if eod != 'null':
                target.append(float(eod))
            else:
                target.append(None)
            if vol != 'null':
                vols.append(int(vol))
            else:
                vols.append(None)

        except Exception as e:
            print("Exception in formatting stock for JSON file: " + str(e))
            continue

    dynamic_feat[0] = vols

    entry["start"] = start
    entry["target"] = target
    entry["dynamic_feat"] = dynamic_feat
    entries.append(entry)

# TODO: Export jsonlines file
# NOTE: for whatever reason the new lines don't take on the file, so remember to replace all in visual studio code
f = open("history.json", "w+")
for item in entries:
    item_m = str(item).replace("'", "\"").replace("]},", "]}")
    f.write(item_m)
f.close()