function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

    
  });
  
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

var PANEL = d3.select("#sample-metadata");

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    //var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples_array= data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredArray = samples_array.filter(x => x.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample= filteredArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleOtuId=firstSample.otu_ids;
    var sampleOtuLabel=firstSample.otu_labels;
    var sample_values=firstSample.sample_values;
    //console.log(sampleOtuId);
   // console.log(sample_values);
    //console.log(sampleOtuLabel);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    //values.sort((a,b) => b-a).slice(0,5);
    var yticks =  sampleOtuId.slice(0,10).map(x=>"OTU" + x).reverse();
    //console.log(yticks);
    

    // 8. Create the trace for the bar chart. 
    var trace={

      x:sample_values.slice(0,10).reverse(),
      y:yticks,
      type:"bar",
      orientation :'h',
      text :sampleOtuLabel.slice(0,10).reverse()
  };

    var barData = [trace];
   
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    
    };
    // 10. Use Plotly to plot the data with the layout. 
    //PANEL.append("h6").text("hello");
    Plotly.newPlot("bar",barData,barLayout);

    // Deliverable 2
    // 1. Create the trace for the bubble chart.
    
    var trace ={
      x:sampleOtuId,
      y:sample_values,
      mode:'markers',
      marker :{
        size:sample_values,
        color:sampleOtuId,
        colorscale:'Earth'
              },
      text :sampleOtuLabel
    }
    var bubbleData = [trace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margin: {
        l: 100,
        r: 100,
        b: 50,
        t: 70,
       },
      hovermode:'closest'
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    //Deliverble 3 : gauge 
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metaDataResult = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMetaData = metaDataResult[0];
    console.log(firstMetaData);

    // 3. Create a variable that holds the washing frequency.
    var washingFrequence = firstMetaData.wfreq;

    // 4. Create the trace for the gauge chart.
    trace={
      value:washingFrequence,
      type :"indicator",
      mode :"gauge+number",
      title: { text: '<b> Belly Button Washing Frequency </b>' + '<br> Scrubs per Week </br>'},
      gauge: {
        axis: { range: [0, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "blue"},
          {range: [2, 4], color: "pink"},
          {range: [4, 6], color: "orange"},
          {range: [6, 8], color: "yellowgreen"},
          {range: [8, 10], color: "yellow"}
        ]}
      };
    var gaugeData = [trace];
 
     // 5. Create the layout for the gauge chart.
     var gaugeLayout = { 
      width: 500,
      height: 400,
      automargin : true,
      paper_bgcolor: "lavender",
    
    };
 

    // 6. Use Plotly to plot the gauge data and layout.    
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

    
  });
}
