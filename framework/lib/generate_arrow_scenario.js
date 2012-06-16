var fs = null;
var temp = null;
var feature = false;
var feature_file = "";
var scenario = false;
var examples = false;
var feature_tag = [];
var scenario_tag = [];
var output = [];
var current_scenario = "";
var test_name = "";
var test_home = "";
var json_file = "";
var step_number = 1;

function delay(ms) {
  var timer = setTimeout(function(){ /*console.log(timer);*/ }, ms);
}

function saveInit() {
    fs.writeFile('./config/bow-init-config.json', JSON.stringify(output,null,2));
    delay(5000);
}

function loadInit() {
    var data;
	try {
        var data = fs.readFileSync('./config/bow-init-config.json');
        console.log("loadInit : data - "+data);
        if (data) {
            output = JSON.parse(data);
        }
    }
    catch(e) {
	}
    return data&&data.length>0;
}

function init(arrow) {
  fs = require('fs');
  if (arrow&&arrow.length>0&&String(arrow).match(/--(driver|browser|reuseSession)/gi)&&!String(arrow).match(/nodejs/gi)) {
	  temp = fs.readFileSync("./framework/step_template.js",'utf8');	
  }
  else {
	  temp = fs.readFileSync("./framework/step_template_nodejs.js",'utf8');		
  }
  feature = false;
  feature_file = "";
  scenario = false;
  examples = false;
  feature_tag = [];
  scenario_tag = [];
  output =
[
{
"settings" : ["master"],
"name" : "",
//"description" : [],
"commonlib" : "./framework/lib/common.js",
"config" : {
"yahoo" : "http://www.yahoo.com",
},
"dataprovider" : {
}
}
];
  current_scenario = "";
  test_name = "";
  test_home = "./features/step_definitions/";
  json_file = "";
  step_number = 1;
  if (!loadInit()) {
	saveInit();
  }
}

function trim(str) {
  return String(str).replace(/(^[\s]*)|([\s]*$)/g, "");
}

function handleBackground(keyword, name, description, line) {
}

function handleComment(comment, line) {
  //console.log("handleComment: "+comment+" @ line:"+line);
}

function handleDocString(contentType, string, line) {
  //console.log("handleDocString: "+"contentType:"+contentType+" string:"+string+" @ line:"+line);
  if (current_scenario.length>0) if (scenario||examples) {
    var current = output[0].dataprovider[current_scenario].params.scenario.length-1;
    if (current>=0) {
      output[0].dataprovider[current_scenario].params.scenario[current].documentStrings= string.split(/\r\n|\r|\n/);
      output[0].dataprovider[current_scenario].params.scenario[current].documentAtLine= line;
    }   
  }
}

function handleEof() {
  //console.log("handleEof:");
  //if (output[0].description.length==0) {
  //  delete output[0].description;
  //}
}

function handleExamples(keyword, name, description, line) {
  //console.log("handleExamples: "+" keyword:"+keyword+""+" name:"+name+""+" description:"+description+" @ line:"+line);
  feature = false;
  scenario = false;
  examples = true;	
}

function handleFeature(keyword, name, description, line) {
  //console.log("handleFeature: "+" keyword:"+keyword+""+" name:"+name+""+" description:"+description+" @ line:"+line);
  feature = true;
  scenario = false;
  examples = false;
  output[0].name = keyword+":";
  if (name.length>0) {
    output[0].name += " "+name;
  }

  json_file = "";
  output[0].name.match(/[a-z,A-Z:]*/g).forEach(function(m){json_file+=m.replace(/(,|:|\s)/g,"_");});
  json_file += ".json";

  //if (description.length>0) {
  //  var lines = description.split(/\r\n|\r|\n/);
  //  lines.forEach(function(desc){
  //    var next = output[0].description.length;
  //    output[0].description[next] = desc;
  //  });
  //}
}

function handleDataTableRow(cells, line) {
  //console.log("handleDataTableRow: cells:"+cells+" @ line:"+line);
  cells.forEach(function(cell){
    //console.log("cell:"+cell);
  });
}

function handleScenario(keyword, name, description, line) {
  //console.log("handleScenario: "+" keyword:"+keyword+""+" name:"+name+""+" description:"+description+" @ line:"+line);
  feature = false;
  scenario = true;
  examples = false;
  current_scenario = name;
  step_number = 1;
  //var yui_test_match = current_scenario.match(/(^test|should)/i);
  //if (!yui_test_match) {
  //  current_scenario = "Test "+current_scenario;
  //}
  output[0].dataprovider[current_scenario]={"group":"","params":{"scenario":[]}};
  var cb_tag_handler = function(tag) {
      tag = tag.replace("@","");
      if (output[0].dataprovider[current_scenario].group.length==0) {
        output[0].dataprovider[current_scenario].group=tag;
      }
      else {
        output[0].dataprovider[current_scenario].group+=","+tag;
      }
    };

  if (feature_tag.length>0) {
    feature_tag.forEach(cb_tag_handler);
  }
  if (scenario_tag.length>0) {
    scenario_tag.forEach(cb_tag_handler);
    scenario_tag=[];
  }
}

function handleScenarioOutline(keyword, name, description, line) {
  console.log("handleScenarioOutline: "+" keyword:"+keyword+""+" name:"+name+""+" description:"+description+" @ line:"+line);
}

function handleStep(keyword, name, line) {
  //console.log("handleStep: "+" keyword:"+keyword+""+" name:"+name+""+" @ line:"+line);
  if (current_scenario.length>0) {
    var next = output[0].dataprovider[current_scenario].params.scenario.length;
    var step = keyword+name;

    var STR = [];
    step = step.replace(/"([^"]*)"/g,function(str) {
	    STR.push(str.replace(/"/g,''));
        return "\"$STR\"";
    });
    var NUM = [];
    step = step.replace(/[+-]?((\d+(\.\d*)?)|\.\d+)([eE][+-]?[0-9]+)?/g,function(num) {
	    if (num.match(/(\.|\d+[eE][+-]?[0-9]+)/)) {
		    NUM.push(parseFloat(num));
	    }
	    else
	    {
		    NUM.push(parseInt(num));		
	    }
        return "$NUM";
    });

    test_name = "";
    step.match(/[a-z,A-Z:"\s]*/g).forEach(function(m){test_name+=m.replace(/(,|:|\s|")/g,"_");});
    test_name += ".js";
    output[0].dataprovider[current_scenario].params.scenario[next]={
      "step":step_number,
      "test":test_home+test_name,
      "match":keyword+name,
      "feature":feature_file,
      "line":line
    };
    if (step_number==1 && output[0].config.yahoo) {
      output[0].dataprovider[current_scenario].params.scenario[next].page = "$$config.yahoo$$";
    }
    step_number++;
    if (STR.length>0) {
      output[0].dataprovider[current_scenario].params.scenario[next].STR = STR;
    }
    if (NUM.length>0) {
      output[0].dataprovider[current_scenario].params.scenario[next].NUM = NUM;
    }

    var exist = false;
    var path = require('path');
    var exist = path.existsSync(test_home+test_name);
    if (!exist) {
      //console.log("Writing "+test_name);
      fs.writeFileSync(test_home+test_name, 
          temp.replace(/\$\$FeatureName\$\$/g,output[0].name).replace(
              /\$\$Step\$\$/g,"test "+step.replace(/"/g,'\\"')), 'utf8');
    }
  }
}

function handleTag(tag, line) {
  //console.log("handleTag: "+" tag:"+tag+" @ line:"+line);
  if (output[0].name.length==0) {
    //console.log("before feature");
    feature_tag.push(tag);
    //console.log("feature_tag:"+feature_tag);
  }
  else {
    //console.log("before scenario");
    scenario_tag.push(tag);
    //console.log("scenario_tag:"+scenario_tag);
  }
}


function getEventHandlers() {
      return {
        background: handleBackground,
        comment:    handleComment,
        doc_string: handleDocString,
        eof:        handleEof,
        examples:   handleExamples,
        feature:    handleFeature,
        row:        handleDataTableRow,
        scenario:   handleScenario,
        scenario_outline: handleScenarioOutline,
        step:       handleStep,
        tag:        handleTag
      };
}

function parse(featureSource) {
  var Gherkin  = require('gherkin');
  var Lexer = Gherkin.Lexer('en');
  var lexer = new Lexer(getEventHandlers());
  lexer.scan(featureSource);
}

exports = module.exports = nano = function generate(input,feature_file_path,arrow) {
  //console.log("[BDD][DEBUG] Parser: input - "+input);
  //console.log("[BDD][DEBUG] Parser: feature_file_path - "+feature_file_path);
  //console.log("[BDD][DEBUG] Parser: arrow - "+arrow);

  init(arrow);
  feature_file = feature_file_path;

  //console.log("[BDD][DEBUG] Parser: begin");
  parse(input);
  //console.log("[BDD][DEBUG] Parser: end");

  //console.log("[BDD][DEBUG] Create arrow scenario files: begin");
  var output_json_string = (feature||scenario)?JSON.stringify(output,null,2):"";
  //console.log("[BDD][DEBUG] output_json_string:"+output_json_string);
  //console.log("[BDD][DEBUG] Writing "+json_file);
  fs.writeFileSync("./"+json_file, output_json_string, 'utf8');
  //console.log("[BDD][DEBUG] Reading template file.");
  //console.log("[BDD][DEBUG] Checking "+test_name);
  //console.log("[BDD][DEBUG] Create arrow scenario files: end");

  var util = require('util');
  var exec = require('child_process').exec;
  function puts(error, stdout, stderr) {
    //var result = stdout.length>0?stdout.match(/\[(BDD|ERROR)\](.*)/g):[];
    var result = stdout.length>0?stdout.split(/\r\n|\r|\n/):[];
    result.forEach(function(res){
      //if (res.match(/ERROR/)) {
      //  util.puts(res.replace(/\[ERROR\]/g,"\033[0;31m[ERROR]"));
      //}
      //else if (res.match(/BDD/)) {
      //  util.puts(res.replace(/\[BDD\]/g,""));
      //}
      //else {
        util.puts(res);
      //}
    });
  }

  if (arrow && String(arrow).match(/--dryrun/i)) {
	  return output_json_string;	
  }
  var arrow_args = "";
  arrow.forEach(function(arg){arrow_args+=" "+arg;});
  var command = "arrow ./"+json_file+arrow_args;//+" | grep -E \"(BDD|ERROR)\"";
  console.log("\033[0;32mExecute command - " + command);
  exec(command,puts);
  return output_json_string;
}
