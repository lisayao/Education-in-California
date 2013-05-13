
Please run our project code in Chrome. In addition to Chrome, 
certain features of our visualization require a simple python 
server to run, so please execute the following steps before 
opening the page in a browser.

Setting up a python server:
1) In terminal, navigate to the folder "Project_3"
2) Type this into your terminal while in the folder: python -m SimpleHTTPServer 8888
3) Open "http://localhost:8888/" in Chrome


Functional decomposition:

index.html is our main and only html page, it carries the visualization itself including the base svg of the California state map

main.js is the primary javascript document for the project, it handles the table, the scatterplot, the display of data, brushing, linking, intro.js explanations, and the looping back to the top of the page implemented in the text of the website.

edumap.js handles the javascript for the choropleth map of California.

style.css is our main css sheet, it handles the styling for all parts of the page except for the intro.js stylings which are contained in introjs.css

introjs.css contains stylings modified from intro.js to match our background and layout.

intro.js is the source file for the intro.js package.

data.js is the JSON file containing our scraped and cleaned FULL dataset (not close to all of which is actually used by the final visualization)



Sources:

Boilerplate for non-brushing scatterplot: http://bl.ocks.org/mbostock/3887118
SVG Map: http://commons.wikimedia.org/wiki/File:California_county_map_(labeled).svg
Example code for brushing: http://static.cybercommons.org/js/d3/examples/brush/brush.html
Data: http://dq.cde.ca.gov/dataquest
