  const cs_date_delimiter = "/";

  Date.prototype.subDate = function (vDate) {
    var d1 = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var d2 = new Date(vDate.getFullYear(), vDate.getMonth(), vDate.getDate());
    return Math.floor((d1 - d2) / 86400000);
  }

Date.prototype.format = function () {
    var dd = strPad(this.getDate(), 2, "0");
    var mm = strPad(this.getMonth() + 1, 2, "0"); //January is 0!
    var yyyy = this.getFullYear();
    return dd + cs_date_delimiter + mm + cs_date_delimiter + yyyy;
  }

  Date.prototype.addDays = function (num) {
      var value = this.valueOf();
      value += 86400000 * num;
      return new Date(value);
  }

  var gInput = new function () {
    this.selected = 0;
    this.date1 = new Date();
    this.day1 = 0;
    this.valid1 = false;
    this.date2 = new Date();
    this.day2 = 0;
    this.valid2 = false;
  }
  var gOut;
  var gOut2;
  var gOut3;
  var gIsFileRun;
  
  function mylog(txt) {
    if ((gOut instanceof Object) == false) {gOut = document.getElementById("outputtext");}
    var v_radioAppend = document.getElementsByName("radioAppend");  
    if (v_radioAppend[0].checked != true) { gOut.value = "";  }
    gOut.value += txt + "\n";  
  }
  
  function output2(txt) {
    if ((gOut2 instanceof Object) == false) {gOut2 = document.getElementById("tdOutput2");}
    gOut2.innerHTML = txt;
  }
  function output3(txt) {
    if ((gOut3 instanceof Object) == false) {gOut3 = document.getElementById("tdOutput3");}
    gOut3.innerHTML = txt;
  }

  function view_gInput() {
    var txtOut = "selected:" + gInput.selected + " day1:" + gInput.day1;
    if ( gInput.valid1==true) {
      txtOut += " date1: " + gInput.date1.format(); 
    } else {
      txtOut += " date1: unknown"; 
    }
    txtOut += " day2:" + gInput.day2;
    if ( gInput.valid2==true) {
      txtOut += " date2: " + gInput.date2.format(); 
    } else {
      txtOut += " date2: unknown"; 
    }
    
    mylog(txtOut);
  }

  function is_leap_year(year)  {
    var result = true;
    if ( (year%4) != 0 )           //  or:    if ( year%4 )
        result = false;            //  means: if year is not divisible by 4
    else if ( (year%400) == 0 )    //  or:    if ( !(year%400) )
        result = true;             //  means: if year is divisible by 400
    else if ( (year%100) == 0 )    //  or:    if ( !(year%100) )
        result = false;            //  means: if year is divisible by 100
    else                           //  (but not by 400, since that case
        result = true;             //  considered already)
    
    return ( result );
  }
  function selDate_change(idx) {
    var selDay = document.getElementById("selDay" + idx);
    var selMonth = document.getElementById("selMonth" + idx);
    var selYear = document.getElementById("selYear" + idx);
    var selDay_value = parseFloat(selDay.options[selDay.selectedIndex].value);
    var selMonth_value = parseFloat(selMonth.options[selMonth.selectedIndex].value);
    var selYear_value = parseFloat(selYear.options[selYear.selectedIndex].value);
    
    if ((selDay_value == -1) || (selMonth_value == -1) || (selYear_value == -1)) {
      return false;
    }
    if ((selMonth_value == 1) && (selDay_value > 28)) {
      if (is_leap_year(selYear_value)) {
        selDay_value = 29;
        selDay.selectedIndex = selDay_value - 1 ;
        //selDay1_value.selectedIndex = 28; // valid on form
      } else {
        selDay_value = 28;
        selDay.selectedIndex = selDay_value - 1;
      };
    }
    if (((selMonth_value == 3) || (selMonth_value == 5) || (selMonth_value == 8) || (selMonth_value == 10)) && (selDay_value > 30)) {
      selDay_value = 30;
      selDay.selectedIndex = selDay_value - 1;
    };
    if (idx==1) {gInput.date1 =  new Date(selYear_value, selMonth_value, selDay_value);}
    else {gInput.date2 = new Date(selYear_value, selMonth_value, selDay_value);}
    
    return true;
  }
  
  function selType_change() {
    gInput.selected = parseInt(selType.selectedIndex);
    if (gInput.selected < 2) {
      id_tdAge.style.visibility = "hidden";
      gInput.day1 = gInput.selected * 40*7;
    } else {
      id_tdAge.style.visibility = "visible";
      gInput.day1 = parseInt(selAgeWeeks1.options[selAgeWeeks1.selectedIndex].value)*7 + parseInt(selAgeDays1.options[selAgeDays1.selectedIndex].value);;
    }
    selDay1.value = "-1";
    gInput.valid1 = false;
    output2("");
    output3("");
  }
  
  function selAge1_change() {
    gInput.day1 = parseInt(selAgeWeeks1.options[selAgeWeeks1.selectedIndex].value)*7 + parseInt(selAgeDays1.options[selAgeDays1.selectedIndex].value);
    output2("");
    output3("");
  }
  
  function selAge2_change() {
    gInput.day2 = parseInt(selAgeWeeks2.options[selAgeWeeks2.selectedIndex].value)*7 + parseInt(selAgeDays2.options[selAgeDays2.selectedIndex].value);
    output3("");
  }
  function selDate1_change() { // O nhap ngay thang nam selDay1, selMonth1, selYear1 thau doi
    gInput.valid1 = selDate_change(1);
    output2("");
    output3("");
  }
  
  function selDate2_change() { // O nhap ngay thang nam selDay2, selMonth2, selYear2 thau doi
    gInput.valid2 = selDate_change(2);
    output2("");
  }
  function calHeader() {
    var v_curdate = new Date();
    var txtOut = "Hôm nay: " + v_curdate.format() + "";
    var v_0w = gInput.date1.addDays(0-gInput.day1);
    var v_days = v_curdate.subDate(v_0w);
    txtOut += " Tuổi thai: " + Math.floor(v_days/7) + "w" + (v_days - Math.floor(v_days/7)*7) + "d\n";
    if (gInput.selected < 2) {
      txtOut += " theo " + selType.options[gInput.selected].text + " " + gInput.date1.format();
    } else {
      txtOut += " theo " + selType.options[gInput.selected].text + " thai " + 
      Math.floor(gInput.day1/7) + "w" + (gInput.day1 - Math.floor(gInput.day1/7)*7) + "d ngày " + gInput.date1.format();
    }
    return txtOut +  "\n";
  }
  function cal1_click() {
    if (gInput.valid1 == false) {mylog("dữ liệu không hợp lệ"); 
    } else {mylog(calHeader());}
  }
  
  function cal2_click() {
    if (gInput.valid1 == false) {mylog("dữ liệu không hợp lệ"); 
    } else {
      var txtOut = calHeader();
      var v_0w = gInput.date1.addDays(0-gInput.day1);
      var str = document.getElementsByName("week_year")[0].value;
      if (!gIsFileRun) {
        var strCk = getCookie("week_year");
        // alert(strCk);
        if (str != strCk) {
      	setCookie("week_year", str, 365);
        }
      } else {
         // alert("not use cookie");
      }
      
      var arrWeeks = str.split(","); 
      for (i = 0; i < arrWeeks.length; i++) { 
        txtOut += arrWeeks[i] + "w: " + (v_0w.addDays(7*arrWeeks[i])).format() + "\n";
      }
      mylog(txtOut);
    }
  }
  
  function calToAge_click() {
    if (gInput.valid1 == false) {
      mylog("dữ liệu không hợp lệ");
    } else {
      if (gInput.valid2 == false) {
        mylog("dữ liệu không hợp lệ");
      } else {
        var v_0w = gInput.date1.addDays(0-gInput.day1);
        var v_days = gInput.date2.subDate(v_0w);
        var txtOut = "thai " + Math.floor(v_days/7) + "w" + (v_days - Math.floor(v_days/7)*7) + "d";
        output2(txtOut);
        mylog("ngày " + gInput.date2.format() + " " + txtOut);
      }
    }
  }
  
  function calToDate_click() {
    if (gInput.valid1 == false) {
      mylog("dữ liệu không hợp lệ");
    } else {
      var v_0w = gInput.date1.addDays(0-gInput.day1);
      v_date = v_0w.addDays(gInput.day2);
      output3(v_date.format());
      var txtOut = "thai " + Math.floor(gInput.day2/7) + "w" + (gInput.day2 - Math.floor(gInput.day2/7)*7) + "d";
      mylog("ngày " + v_date.format() + " " + txtOut);
    }
  }
function AddOptionItems(id, valueStart, valueStop) {
    var x = document.getElementById(id);
    for (var i = valueStart; i < valueStop + 1; i++) {	
        var c = document.createElement("option");
        c.text = i;
        c.value = i;
        x.options.add(c);        
     }
}

function AddMonthOptionItems(id, valueStart, valueStop) {
    var x = document.getElementById(id);
    for (var i = valueStart; i < valueStop + 1; i++) {	
        var c = document.createElement("option");
        c.text = i;
        c.value = i - 1;
        x.options.add(c);        
     }
}
function strPad(a, b, c) {
  return c = c || "0", a += "", a.length >= b ? a : new Array(b - a.length + 1).join(c) + a
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loadCookie() {
    var strWeek = getCookie("week_year");
    if (strWeek != "") {
		document.getElementsByName("week_year")[0].value = strWeek;
	} else {
		strWeek = document.getElementsByName("week_year")[0].value;
        setCookie("week_year", strWeek, 365);
	}
}

function my_onload() {
    // Khoi tao gia tri ban dau cho gInput
      var iyear = new Date().getFullYear();
      AddOptionItems("selAgeWeeks1",6,23);
      AddOptionItems("selAgeDays1",0,6);
      AddOptionItems("selDay1",1,31);
      AddMonthOptionItems("selMonth1",1,12);
      AddOptionItems("selYear1",iyear - 2,iyear + 2);      	
      AddOptionItems("selDay2",1,31);      	      	
      AddMonthOptionItems("selMonth2",1,12);      	      	
      AddOptionItems("selYear2",iyear - 2,iyear + 2);      	
      AddOptionItems("selAgeWeeks2",5,41);            
      AddOptionItems("selAgeDays2",0,6);
      gIsFileRun = window.location.href.indexOf("file")==0;
      if (!gIsFileRun) {      
        loadCookie();
      }
    selType_change(); // day1
    selAge2_change(); //day2
 //   document.body.style.zoom = "300%" 
  
  }
  window.onload = my_onload;

