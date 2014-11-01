//массив данных
var nodes;
//скорость анимации
var speed = 20;
//количество элементов в массиве
var amount = 50;

function generate(){
	//проверка введенных параметров
	var amountInput = parseInt($("#tbElements").val());
	if(amountInput)
		amount = amountInput;

	if(amount > 200)
		amount = 200;
	if(amount < 1)
		amount = 1;

    var width = 960,
		height = 500,
		padding = 45;
	
	d3.select("svg").remove();

	//создаем массив объектов с параметрами: радиус, номер, координаты x и y
	nodes = d3.range(amount).map(function(i) { return {
		radius: Math.random() * 20 + 1, 
		index: i, 
		x: padding + (i % 20 * padding), 
		y: padding + Math.floor(i / 20) * padding 
	}; });
	
	//встроенная в d3 палитра цветов
	var color = d3.scale.category10();

	//добавляем SVG
	var svg = d3.select("#container").append("svg")
	    .attr("width", width)
	    .attr("height", height);

    //Из набора данных создаются объекты SVG
    var circles = svg.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
	    .attr("r", function(d) { return d.radius; })
	    .attr("id", function(d) { return "circle" + d.index; })
	    .attr("cx", function(d) { return d.x; } )
	    .attr("cy", function(d) { return d.y; } )
	    .style("fill", function(d, j) { return color(j % 2); });
}

//первоначальный набор данных.
generate();

//Функция перемещения двух элементов
function swap(nodes, index, delay){	    	
	var node1 = nodes[index];
	var node2 = nodes[index + 1];
	//выбираем круги, соответсвующие переставляемм элементам массива
	var circle1 = d3.select("#circle" + node1.index);
	var circle2 = d3.select("#circle" + node2.index);

	//запоминаем координаты кругов
	var c1x = node1.x;
	var c1y = node1.y;
	var c2x = node2.x;
	var c2y = node2.y;

	//проставляем новые координаты в меняемые элементы массива
	node1.x = c2x;
	node1.y = c2y;
	node2.x = c1x;
	node2.y = c1y;	    	

	//передвигаем круг 1 на место круга 2
	circle1
    .transition()		    
    .duration(speed)
    .attr("cx", c2x)
    .attr("cy", c2y);

    //передвигаем круг 2 на место круга 1
    circle2
    .transition()		    
    .duration(speed)
    .attr("cx", c1x)
    .attr("cy", c1y);   	
}

//Номер элемента на котором был прерван цикл
var i0 = 0;
//Количество итераций
var iterations = 0;
//Количество полных проходов
var passCount = 0;

//Шаг сортировки. Происходит не более одной подстановки
//Возвращает true в случае совершения перестановки, иначе false
function sortStep(){	
    var swapped = false;
    for (var i=i0; i < nodes.length-1-passCount; i++) {	 
    	iterations++;
        if (nodes[i].radius > nodes[i+1].radius) {
            var temp = nodes[i];
            nodes[i] = nodes[i+1];
            nodes[i+1] = temp;
            swap(nodes, i);
            //запоминаем на каком шаге остановились
            i0 = i;
            return true;
        }
    }

    //Если не произошло ни одной перестановки за полный проход, значит данные отсортированы
    if(i0 == 0){
    	passCount = 0;
    	return false;
    }

    //Если за неполный проход не произошло перестановок, начианем сначала.
    i0 = 0;
    passCount++;
    return true;
}

function sortButtonClick(){
	$("#btnSort").prop("disabled",true);
	$("#btnGenerate").prop("disabled",true);
	var speedInput = parseInt($("#tbSpeed").val());
	if(speedInput)
		speed = speedInput;
	if(speed < 1)
		speed = 1;
	if(speed > 1000)
		speed = 1000;
	sort();
}

//сортирует данные
function sort(){
	//рекурсивный вызов себя, перед вызовом делаем паузу, 
	//во время которой на интерфейсе происходит одна перестановка элеметов
	if(sortStep())
		setTimeout(sort, speed);
	else{
		console.log(iterations);
		iterations = 0;
		$("#btnSort").prop("disabled",false);
		$("#btnGenerate").prop("disabled",false);
	}
}

function help(){
	console.log("?");
	$("#help").dialog({
		autoOpen: true,
		width: 800,
		buttons: [
			{
				text: "Закрыть",
				click: function() {
					$( this ).dialog( "close" );
				}
			}
		]
	});	
}