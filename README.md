# DREDA
dimensionality reduced exploratory data analysis
http://metasyn.pw/dreda/

# What

Explore high dimensionality data via reduction and exploration using Three.js

# Why

Sometimes you have too many fields, features, columns... dimensions, to your data. 

[Wikipedia](http://en.wikipedia.org/wiki/Dimensionality_reduction):
>In machine learning and statistics, dimensionality reduction or dimension reduction is the process of reducing the number of random variables under consideration, and can be divided into feature selection and feature extraction.

If you reduce your data down, say via [SVD](http://en.wikipedia.org/wiki/Singular_value_decomposition) or [t-SNE](http://en.wikipedia.org/wiki/T-distributed_stochastic_neighbor_embedding), to three dimensions, you can visualize it with this tool. Currently Dreda supports 4 dimensions (x,y,z, and color). Color assignments are chosen randomly. 

I had been doing some visualizations in iPython and they left much to be desired. The data input here is just the ouput of a pandas data frame `to_json()` - a JSON object with an inner object for each column - index and value pairs in each inner object

E.g.
```
{
  "x":
  {
    "0":117.0501353217,
    "1":63.4789054268,
    "2":-92.4110611211
  },
  "y":
    {
      "0":-33.8277679817,
      "1":120.3959209587,
      "2":172.3790645372
    },
  "z":
    {
    "0":-17.441790351,
    "1":-34.4737315608,
    "2":-224.6172323059
    },
  "cid":
    {
      "0":4.0,
      "1":1.0,
      "2":4.0
    }
}
```
# How

Clone, run `python -m SimpleHTTPSever`, and open `localhost:8000` in your browser.  
Open index.html and click "Plot Data".

## Authors 

* Xander Johnson

## License
WTFPL

