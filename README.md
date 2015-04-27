# DREDA
dimensionality reduced exploratory data analysis

# What

Explore high dimensionality data via reduction and exploration using Three.js

# Why

Sometimes you have too many fields, features, columns... dimensions, to your data. 

[Wikipedia](http://en.wikipedia.org/wiki/Dimensionality_reduction):
>In machine learning and statistics, dimensionality reduction or dimension reduction is the process of reducing the number of random variables under consideration, and can be divided into feature selection and feature extraction.

If you reduce your data down, say via [SVD](http://en.wikipedia.org/wiki/Singular_value_decomposition) or [t-SNE](http://en.wikipedia.org/wiki/T-distributed_stochastic_neighbor_embedding), to three dimensions, you can visualize it with this tool. Currently Dreda supports 4 dimensions (3 floats: x,y,z, and one int, color). Colors are chosen randomly. 

I had been doing some visualizations in iPython and they left much to be desired. The data input here is just the ouput of a pandas data frame `to_json()` - a JSON object with an inner object for each column - index and value pairs in each inner object

E.g.

Object { Object x { 1: value1, 2: value2... n : value-n}, Object y { 1: value1 ... } }

# How

Clone, run `python -m SimpleHTTPSever`, and open `localhost:8000` in your browser.  
Open the console, and run the function `plotData()`. 

## Authors 

* Xander Johnson

## License

