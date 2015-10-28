console.log('Assignment-4-A')
var margin = {t:50,r:125,b:50,l:125};

var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.plot')
    .append('svg')
    .attr('width',width + margin.r + margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Scale for the size of the circles
var scaleR = d3.scale.sqrt().domain([0,120]).range([5,100]);


d3.csv('data/olympic_medal_count.csv', parse, dataLoaded);

function dataLoaded(err,rows){

    var year=1900;
    rows.sort(function(a,b){
        //Note: this is called a "comparator" function
        //which makes sure that the array is sorted from highest to lowest
        return b[year] - a[year];
    });

    //Note: this returns "top5" as a subset of the larger array "rows", containing positions 0,1,2,3,4
    var top5 = rows.slice(0,5);
    console.log(top5)
    //Call the draw function
    draw(top5, year);

    //TODO: fill out this function
    d3.selectAll('.btn-group .year').on('click',function(){
        //e.preventDefault();
        var year = d3.select(this).attr('data-year');

        console.log("Show top 5 medal count for: " + year);
        console.log(year);
        var year2;
        year2=+year;
        draw(rows, year2);
        return;
    });
}


function draw(rows, year){
    //TODO: Complete drawing function, accounting for enter, exit, update
    //Note that this function requires two parameters
    //The second parameter, "year", determines which one of the three years (1900,1960,2012) to draw the medal counts based on
    console.log(rows, year);
    rows.sort(function(a,b){
        //Note: this is called a "comparator" function
        //which makes sure that the array is sorted from highest to lowest
        return b[year] - a[year];
    });

    //Note: this returns "top5" as a subset of the larger array "rows", containing positions 0,1,2,3,4
    var top5 = rows.slice(0,5);
    console.log(top5)
    //Call the draw function

    var group=canvas.selectAll('.Olympic')
        .data(rows,function(d){return d.country})

    var groupEnter=group.enter().append('g')
        .attr('class','Olympic')
        .attr('transform',function(d,i){
            return 'translate(' + i*(width/4) + ',' + 0 + ')';
        })
        .style('opacity',0)
        .on('click',function(d){
            group.selectAll('circle').style('stroke','rgb(70,70,70)')
            d3.select(this).select('circle')
                .style('stroke','blue');
        });
    groupEnter.append('circle')
        .attr('r',function(d){return scaleR(d[year])
        })
        .style('fill','rgba(70,70,70,.1)')
        .style('stroke','rgb(50,50,50)')
        .style('stroke-width','1px');
    groupEnter.append('text')
        .attr('class','team-name')
        .text(function(d){
            return d.country;
        })
        .attr('y',function(d){return scaleR(d[year]+20)})
        .attr('text-anchor','middle');

    groupEnter.append('text')
        .attr('class','medal-count')
        .text(function(d){ return d[year]})
        .attr('text-anchor','middle');

    var groupExit=group.exit()
        .transition()
    .duration(200)
        .attr('transform',function(d,i){
            //i ranges from 0 to 4
            console.log(i);
            return 'translate(' + i*(width/4) + ',' + height/2 + ')';
        })
        .style('opacity',0)
    groupExit.remove();

    var groupUpdate=group.transition().duration(200);
    groupUpdate
        .attr('transform',function(d,i){
            //i ranges from 0 to 4
            console.log(i);
            return 'translate(' + i*(width/4) + ',' + height/2 + ')';
        })
        .style('opacity',1)

    groupUpdate
        .select('circle')
        .attr('r',function(d){return scaleR(d[year])
        })

    groupUpdate.select('.team-name')
        .attr('y',function(d){return scaleR(d[year]+20)})


    groupUpdate.select('.medal-count')
        .text(function(d){ return d[year]})


}




function parse(row){
    //@param row is each unparsed row from the dataset
    return {
        country: row['Country'],
        1900: +row['1900'],
        1960: +row['1960'],
        2012: +row['2012']
    };
}