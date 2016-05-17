 var maindiv = d3.select(".container")
 var leftdiv = d3.select(".left-element")
 var searchBar = d3.select("#searchBar")
 var col, color_scale, color_scaleA;
 var timer = 800;
 var related = [];
 var nodelevel = false;
 var st = "";
 var imcount = [];
 var pbar = 0;
 var wfalse = false;
 var maxhier = 0;
 var rightdiv = d3.select(".right-element")
 var matrify = true;
 var sbb = d3.select("#searchBar").select("span")
 addIcon("images/icons/list-01.svg", "list");
 addIcon("images/icons/matrix-01.svg", "matrix");

 function addIcon(ic, c) {
     var op = 0.25;
     if (c == "matrix") {
         op = 1;
     }
     sbb.append("img").attr("class", c).attr("hspace", 6).attr("width", "15px").attr("src", ic).style("opacity", op).style("float", "right").style("margin-top", "10px")
         .on("mouseover", function () {
             d3.select(this).style("opacity", 1);
             d3.select("body").style("cursor", "pointer");
         })
         .on("mouseout", function () {
             if ((matrify == true && c == "matrix") || (matrify == false && c == "list")) {
                 d3.select(this).style("opacity", 1);
             } else {
                 d3.select(this).transition().duration(timer / 3).style("opacity", 0.25);
             }

             d3.select("body").style("cursor", "default");
         })
         .on("click", function () {

             if (c == "matrix") {
                 matrify = true;
                 d3.selectAll(".list").transition().duration(timer).style("opacity", 0.25)
                 d3.selectAll(".matrix").transition().duration(timer).style("opacity", 1)
             } else {
                 matrify = false;
                 d3.selectAll(".matrix").transition().duration(timer).style("opacity", 0.25)
                 d3.selectAll(".list").transition().duration(timer).style("opacity", 1)
             }
             tilize();
         })
 }

 var allData;
 rightdiv.append("div").attr("class", "nodeName").append("img")
 d3.select(".nodeName").append("text").text("Welcome to the Dynamo Dictionary!").append("hr")
 rightdiv.append("div").attr("class", "nodeHier")
 rightdiv.append("div").attr("class", "nodeGroup")
 rightdiv.append("div").attr("class", "nodeDesc")

 rightdiv.append("div").attr("class", "nodeIn")
 rightdiv.append("div").attr("class", "nodeOut")

 rightdiv.append("div").attr("class", "exampleFile")
 rightdiv.append("div").attr("class", "inDepth")
 rightdiv.append("div").attr("class", "seeAlso")

 function sortArrayOfObjectsByKey(arr, key) {
     if (arr[0][key] != "Action" && arr[0][key] != "Create" && arr[0][key] != "Query") {
         arr.sort(function (a, b) {
             var keyA = (a[key]),
                 keyB = (b[key]);

             if (keyA < keyB) return -1;
             if (keyA > keyB) return 1;
             return 0;
         });
     } else {
         var tempob = {
             "Create": "a",
             "Action": "b",
             "Query": "c"
         };
         arr.sort(function (a, b) {
             var keyA = (tempob[a[key]]),
                 keyB = (tempob[b[key]]);

             if (keyA < keyB) return -1;
             if (keyA > keyB) return 1;
             return 0;
         });

     }
     return arr;
 }
 d3.selectAll("#title").selectAll("span")
     .on("mouseover", function () {
         d3.select('body').style("cursor", "pointer")
         d3.select(this).style("color", "white")

     })
     .on("mouseout", function () {
         d3.select('body').style("cursor", "default")
         d3.select(this).style("color", "gray")

     })

 .on("click", function () {
     goHome();
 })

 function xmlToJson(xml) {

     var obj = {};

     if (xml.nodeType == 1) {

         if (xml.attributes.length > 0) {
             obj["@attributes"] = {};
             for (var j = 0; j < xml.attributes.length; j++) {
                 var attribute = xml.attributes.item(j);
                 obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
             }
         }
     } else if (xml.nodeType == 3) {
         obj = xml.nodeValue;
     }

     if (xml.hasChildNodes()) {
         for (var i = 0; i < xml.childNodes.length; i++) {
             var item = xml.childNodes.item(i);
             var nodeName = item.nodeName;
             if (typeof (obj[nodeName]) == "undefined") {
                 obj[nodeName] = xmlToJson(item);
             } else {
                 if (typeof (obj[nodeName].push) == "undefined") {
                     var old = obj[nodeName];
                     obj[nodeName] = [];
                     obj[nodeName].push(old);
                 }
                 obj[nodeName].push(xmlToJson(item));
             }
         }
     }
     return obj;
 };

 function accordionActivate(but, it, obj) {

     childCheck(but.nextElementSibling)

     turnOffSiblings(but, it)

     function turnOffSiblings(bt, t) {
         var s = d3.selectAll(".button" + t + "");
         for (var j = 0; j < s[0].length; j++) {
             if (s[0][j].classList.contains("active") && s[0][j] != bt) {
                 s[0][j].classList.toggle("active");
                 if (s[0][j].nextElementSibling.classList.contains("show")) {
                     s[0][j].nextElementSibling.classList.toggle("show");
                 }

             }
         }
     }

     if (but.classList.contains("active")) {} else {
         but.classList.toggle("active");

     }
     if (wfalse == false || !but.nextElementSibling.classList.contains("show")) {
         but.nextElementSibling.classList.toggle("show");
     }

     if (wfalse == true) {
         wfalse = false;

         parentCheck(but.parentElement)

     }

     function childCheck(bb) {

         d3.selectAll(bb.children).classed("active", false);
         d3.selectAll(bb.children).classed("show", false);
     }

     function parentCheck(bb) {

         if (bb.classList.contains("show") == false) {
             bb.classList.toggle("show");
             if (bb.previousElementSibling.classList.contains("active") == false) {
                 bb.previousElementSibling.classList.toggle("active");

                 turnOffSiblings(bb.previousElementSibling, it - 1)
             }
         }
         it--;

         if ((it - 1) > 0) {
             parentCheck(bb.parentElement);
         }
     }

 }

 function imageActivate(q, w, tim) {
     imcount.push(w);
     var qq = d3.select(q).data()[0];
     qq.activated = true;

     if (matrify == true) {
         d3.selectAll(".addedText").remove();
         d3.select(q).transition().duration("" + tim + "").attr("width", 30).style("opacity", 100)

     } else {
         d3.select(q).attr("width", 0).transition().duration("" + tim + "").attr("width", 30).style("opacity", 100)

     }

 }

 function imageDeactivate(q, w, tim) {
     var qq = d3.select(q).data()[0];
     qq.activated = false;

     if (matrify == true) {
         d3.select(q).transition().duration("" + tim + "").attr("width", 0).style("opacity", 0)
     } else {
         d3.select(q).transition().duration(0).attr("width", 0).style("opacity", 0)
     }

 }

 function tilize() {
     d3.selectAll(".addedText").remove();
     var ims = d3.selectAll(".imageTiles").selectAll("img")

     ims[0].forEach(function (t, r) {

         var qq = d3.select(t).data()[0];

         if (qq.activated == true) {

             var lili = [];
             qq.Categories.forEach(function (h, j) {
                 lili.push(h)
             })
             lili.push(qq.Group);

             if (matrify == false) {
                 var tt = d3.select(t.parentNode).append("span").style("position", "relative").style("top", "4px").attr("class", 'addedText addedText' + r).text(function () {
                         return "  " + qq.Name + " ";
                     })
                     .on("mouseover", function () {
                         d3.select('body').style("cursor", "pointer")
                         d3.select(this).style("color", "steelblue")
                         d3.selectAll(".im" + r).style("background-color", "steelblue")
                     })
                     .on("mouseout", function () {
                         d3.select('body').style("cursor", "default")
                         d3.select(this).style("color", "white")
                         d3.selectAll(".im" + r).style("background-color", d3.rgb(34, 34, 34))
                     })

                 .on("click", function () {
                         d3.select('body').style("cursor", "default")

                         updateInfo(qq)
                     })
                     .style("opacity", 0).transition().duration(timer * 3).style("opacity", 100)

                 ;

                 lili.forEach(function (e, f) {
                     var ttt = "";
                     var color = "gray";
                     if (f == 0) {
                         if (f != lili.length - 1) {
                             ttt = " " + e + ", ";
                         } else {
                             ttt = " " + e + " ";
                         }
                     } else if (f < lili.length - 1) {
                         ttt = e + ", ";
                     } else {
                         ttt = e;
                     }
                     var catt = d3.select(t.parentNode).append('span').style("position", "relative").style("top", "4px").attr("class", 'addedText').text(ttt).style("color", color)
                         .on("click", function () {
                             wfalse = true;
                             var bbb = testButton(lili, e, f)

                             bbb.click();
                             d3.select('body').style("cursor", "default")

                         })
                         .on("mouseover", function () {
                             d3.select('body').style("cursor", "pointer")
                             d3.select(this).style("color", "white")
                             d3.select(this)
                         })
                         .on("mouseout", function () {
                             d3.select('body').style("cursor", "default")
                             d3.select(this).style("color", "gray")
                         })

                     if (f == lili.length - 1) {
                         catt.append('html')
                     }

                 })
                 d3.select(t.parentNode).append("div").text(qq.Description).attr("class", "addedText descAdd").style("color", "gray").style("padding-left", "50px").style("padding-right", "50px").append('html').html('<br><br>')
             }
         } else {
             d3.selectAll(".addedText" + r).remove();
         }
     })
     d3.select(".imageTiles").append("html").html("<br><br>")
 }

 function testNodeButton(r) {

     var ret;
     d3.selectAll(".accordion").each(function (h, x) {
         if (h.FullCategoryName == r.FullCategoryName && h.Name == r.Name) {
             ret = this;
             return this;
         }
     })
     return ret;
 }

 function testButton(l, r, s) {
     related = [];
     nodelevel = false;
     d3.selectAll(".seeAlso").html("<b>Nodes</b><br><br>");
     var ret;
     d3.selectAll(".accordion").each(function (o, p) {

         if (o.iteration == s && o.Name == r) {
             if (s > 0) {
                 if (l[s - 1] == o.Parent) {
                     ret = this;
                     return this;
                 }
             } else {
                 ret = this;
                 return this;
             }

         }
     })
     return ret;
 }

 function getCats(e, f) {

 }

 var orderedList = [];

 function nameDiv(name) {
     var descript = d3.select(".nodeName")
     descript.select('text').html('' + name + '<hr>')
 }

 function lDistance(a, b) {
     var al = (a.toLowerCase())
     var bl = (b.toLowerCase())

     if (bl.indexOf(al) > -1) {
         return true;
     } else {
         return false;
     }
 };

 function goHome() {
     document.getElementById("searchBox").value = "";
     st = "";
     searchSquish();
     d3.selectAll(".panel").classed("active", false).classed("show", false)
     d3.selectAll(".accordion").classed("active", false).classed("show", false)

     for (var h = 0; h < 8; h++) {
         var s = d3.selectAll(".button" + h + "");
     }
 }

 function searchSquish() {
     d3.selectAll(".nodeDesc").html("")
     d3.selectAll(".nodeIn").html("")
     d3.selectAll(".nodeOut").html("")
     d3.selectAll(".nodeGroup").html("")
     d3.selectAll(".nodeHier").html("")
     d3.selectAll(".inDepth").html("")
     d3.selectAll(".exampleFile").html("")
     var tname = d3.selectAll(".seeAlso").html("<b>Nodes</b><br><br>");

     d3.selectAll(".imageTiles")
     if (st == "") {
         nameDiv("Welcome to the Dynamo Dictionary!")
         entryText();

     } else {
         nameDiv("Search: " + st)
         d3.select(".nodeHier").html("<b>Dynamo Search:</b>&nbsp&nbsp" + st + "  <br><br><hr><br>")
     }

     var ims = d3.selectAll(".imageTiles").selectAll("img")
     var imcount = [];

     ims[0].forEach(function (q, w) {
         var qq = d3.select(q).data()[0];
         checkString = qq.Name + " " + qq.FullCategoryName + " " + qq.Description + " " + qq.SearchTags;
         qq.Categories.forEach(function (d, i) {
             checkString += " " + d
         })
         var searchCount = 0;
         for (var j = 0; j < st.length; j++) {
             if (lDistance(st[j], checkString)) {
                 searchCount++;
             }
         }

         if (searchCount == st.length) {
             imageActivate(q, w, timer);
         } else {
             imageDeactivate(q, w, timer);
         }
     })
     tilize();
 }

 d3.xml("data/Dynamo_Library.xml", function (error, data) {

     $("#searchBox").keyup(function (event) {

         if (event.keyCode == 13) {
             handleClick();
             $(this).blur();
         }
     });
     d3.select("#searchBox").on("blur", function () {

         handleClick();
     })

     function handleClick() {
         imcount = [];
         st = (document.getElementById("searchBox").value).split(" ");

         searchSquish();

     }

     if (error) throw error;
     xmldata = data;

     
     allData = [];

     data = [].map.call(data.querySelectorAll("Category"), function (cat) {
         var catn = cat.getAttribute("Name")

         for (var i = 0; i < cat.children.length; i++) {
             var cn = cat.children[i]
             var nd = {};
             nd["FullCategoryName"] = cn.querySelector("FullCategoryName").textContent;
             nd["Categories"] = nd["FullCategoryName"].split(".")

             nd["TopCategory"] = nd["Categories"][0];
             nd["activated"] = true;
             nd["Name"] = cn.querySelector("Name").textContent;

             nd["Group"] = cn.querySelector("Group").textContent;

             nd["Description"] = cn.querySelector("Description").textContent;
             getParam("Inputs", "InputParameter");
             getParam("Outputs", "OutputParameter");
             nd["SmallIcon"] = cn.querySelector("SmallIcon").textContent.trim();
             nd["LargeIcon"] = cn.querySelector("LargeIcon").textContent.trim();
             nd["SearchTags"] = cn.querySelector("SearchTags").textContent.trim();

             function getParam(val1, val2) {
                 if (cn.querySelector(val1) != undefined) {
                     var vals = (cn.querySelector(val1))
                     vals = vals.querySelectorAll(val2);
                     arr = []

                     for (var q = 0; q < vals.length; q++) {
                         var m = vals[q]
                         ob = {};
                         ob["Name"] = m.getAttribute("Name");
                         ob["Type"] = m.getAttribute("Type");
                         arr.push(ob);
                     }
                     nd[val1] = arr;
                 }
             }
             allData.push(nd)
         }
     });

     allData.forEach(function (d, i) {
         var c = 0;
         allData.forEach(function (e, j) {
             if (_.isEqual(d, e)) {
                 c++;
                 if (c > 1) {
                     allData.splice(j, 1)
                 }
             }
         })
     })

     sortArrayOfObjectsByKey(allData, "TopCategory")

     var hierarchy = {};

     var tempCat = {};

     allData.forEach(function (d, i) {
         var tempCat = hierarchy;
         var c = d.Categories;
         if (c.length > maxhier) {
             maxhier = c.length;
         }
         c.forEach(function (e, j) {
             if (tempCat[e] == undefined) {
                 tempCat[e] = [];
             }
             tempCat = tempCat[e];

             if (j == c.length - 1) {
                 tempCat.push(d);
                 d.finalIndex = true;
             }
         })
     })

     var h2 = {
         "Name": "RootStructure"
     };
     allData.forEach(function (d, i) {
         var c = d.Categories;
         if (c.length > maxhier) {
             maxhier = ct.length;
         }
     })
     var mainlist = objectify(allData, 0)

     function objectify(ad, q) {

         if (Array.isArray(ad)) {
             var ml = [];
             ad.forEach(function (d, i) {
                 var c = d.Categories;

                 var parent = "Home";
                 if (q - 1 >= 0) {
                     parent = c[Math.max(0, q - 1)]
                 }
                 if (q < c.length) {
                     if (ml.length == 0) {
                         ml.push({
                             "Name": c[q],
                             "Arr": [d],
                             "Parent": parent,

                             "iteration": q

                         })
                     } else {
                         var hit = false;
                         ml.forEach(function (f, k) {
                             if (f["Name"] == c[q]) {
                                 hit = true;
                                 f["Arr"].push(d)
                             }
                         })
                         if (hit == false) {
                             ml.push({
                                 "Name": c[q],
                                 "Arr": [d],
                                 "Parent": parent,

                                 "iteration": q
                             })
                         }
                     }
                 } else {
                     if (ml.length == 0) {
                         ml.push({
                             "Name": d.Group,
                             "Arr": [d],
                             "Parent": parent,

                             "iteration": q
                         })
                     } else {
                         var hit = false;
                         ml.forEach(function (f, k) {
                             if (f["Name"] == d.Group) {
                                 hit = true;
                                 f["Arr"].push(d)
                             }
                         })
                         if (hit == false) {
                             ml.push({
                                 "Name": d.Group,
                                 "Arr": [d],
                                 "Parent": parent,

                                 "iteration": q
                             })
                         }
                     }
                 }
                 if (i == ad.length - 1) {
                     ml.forEach(function (h, z) {
                         sortArrayOfObjectsByKey(h.Arr, "Name");
                     })
                 }
             })
             return sortArrayOfObjectsByKey(ml, "Name");

         } else {

             return ad;
         }
     }

     function objectifyGroup(ad) {
         if (Array.isArray(ad)) {
             var ml = [];
             ad.forEach(function (d, i) {
                 var c = d.Group;
                 if (ml.length == 0) {
                     ml.push({
                         "Name": c,
                         "Arr": [d]
                     })
                 } else {
                     var hit = false;
                     ml.forEach(function (f, k) {
                         if (f["Name"] == c) {
                             hit = true;
                             f["Arr"].push(d)
                         }
                     })
                     if (hit == false) {
                         ml.push({
                             "Name": c,
                             "Arr": [d]
                         })
                     }
                 }

             })
             return ml;

         } else {
             return ad;
         }
     }

     mainlist.forEach(function (d, i) {
         d.Arr = objectify(d.Arr, 1)
         d.Arr.forEach(function (e, j) {

             if (e.Name != "Create" && e.Name != "Action" && e.Name != "Query") {
                 e.Arr = objectify(e.Arr, 2)
             }
             e.Arr.forEach(function (f, g) {
                 if (f.Name != "Create" && f.Name != "Action" && f.Name != "Query") {
                     f.Arr = objectify(f.Arr, 3)
                 }
             })
         })
     })

     h2.Arr = mainlist;

     var newHierarchy = {};
     var subList = [];

     color_scale = d3.scale.linear()
         .domain([1, maxhier + 1])
         .range(["#222", "#666"])
         .clamp(true);
     col = "white";

     color_scaleA = d3.scale.linear()
         .domain([1, maxhier + 1])
         .range(["#666", "#999"])
         .clamp(true);

     var addAccordion = function (li, appendel, iteration) {
         var ogo = {
             "Name": ""
         }
         li.forEach(function (obj, j) {
             var bk0 = appendel.append("button").attr("class", "accordion button" + iteration + "")
             bk0.data([obj]).enter()
             var catdiv = appendel.append("div").attr("class", "panel iteration" + iteration + "")

             bk0

                 .style("height", function () {
                     if (iteration == 1) {
                         return "40px";
                     } else {
                         return "28px";
                     }
                 })
                 .style("width", "100%")
                 .on("click", function () {
                     document.getElementById("searchBox").value = "";

                     imcount = [];
                     if (obj.Arr != undefined) {
                         d3.select(".nodeName").html()
                         var descript = d3.select(".nodeName")
                         descript.select('text').html('' + obj.Name + '<hr>')

                         d3.selectAll(".nodeDesc").html("")
                         d3.selectAll(".nodeIn").html("")
                         d3.selectAll(".nodeOut").html("")
                         d3.selectAll(".nodeGroup").html("")
                         d3.selectAll(".nodeHier").html("")
                         d3.selectAll(".inDepth").html("")
                         d3.selectAll(".exampleFile").html("")

                         d3.select(".nodeHier").html("<b>Dynamo Hierarchy:</b>")
                         var catlist = grandChildren(obj)
                         addHierarchy(catlist)
                         d3.select(".nodeHier").append("html").html("<br><hr>")

                         function grandChildren(ob) {
                             if (ob.Arr != undefined) {
                                 return grandChildren(ob.Arr[0])
                             } else {
                                 var lili = [];
                                 ob.Categories.forEach(function (h, j) {
                                     lili.push(h)
                                 })
                                 lili.push(ob.Group);
                                 return (lili.slice(0, obj.iteration + 1))
                             }
                         }
                         getCats(obj.Name, obj.iteration);

                         var ims = d3.selectAll(".imageTiles").selectAll("img")

                         ims[0].forEach(function (q, w) {
                             if (d3.select(q).data()[0].Categories[iteration - 1] == obj.Name || (d3.select(q).data()[0].Group == obj.Name && d3.select(q).data()[0].Categories[Math.max(0, iteration - 2)] == obj.Parent)) {
                                 if (iteration > 1) {
                                     imageActivate(q, w, 800)
                                 } else {
                                     imageActivate(q, w, 0)
                                 }
                             } else {
                                 if (iteration > 1) {
                                     imageDeactivate(q, w, 800)
                                 } else {
                                     imageDeactivate(q, w, 0)
                                 }
                             }
                             if (w == ims[0].length - 1) {
                                 tilize();
                             }
                         })
                     } else {
                         d3.selectAll(".imageTiles").selectAll("img").attr("width", "0")
                         var ddd = d3.select(this);
                         var displayObject = (obj)

                         updateInfo(displayObject);

                     }
                     accordionActivate(this, iteration, obj);

                     if (d3.select(this).classed("active") == false && obj.Arr != undefined) {
                         d3.select(this).style("background-color", "gray")
                     }

                 })
                 .style("font-size", 12 + "px")

             .style("padding-left", 10 + Math.max(0, (iteration - 1)) * 6 + "px")
                 .style("padding-right", "12px")

             bk0.html("" + obj["Name"] + "")

             if (obj["Arr"] != undefined) {
                 obj.Arr.forEach(function (k, z) {
                     if (k["FullCategoryName"] != undefined) {
                         k.it=orderedList.length;
                         orderedList.push(k)
                         var spanner = bk0.append("span").attr("class", "middle")
                     }
                 })

                 addAccordion(obj.Arr, catdiv, iteration + 1)
             } else {

                 bk0.html("")
                 var spanner = bk0.append("span").attr("class", "middle")

                 var image = getImagePath(obj)
                 spanner.append("img").attr("src", image).attr("class","copy"+obj.it).attr("width", 20).style("background-color", d3.rgb(34, 34, 34)).attr("align", "middle").attr("onerror", "this.onerror=null;this.src='images/src/icon_offset.png';")

                 function override(oo) {
                     var tl = "(";
                     if (oo["Inputs"] != undefined) {
                         oo["Inputs"].forEach(function (e, k) {
                             if (k < oo["Inputs"].length - 1) {
                                 tl += "" + e.Name + ", ";
                             } else {
                                 tl += "" + e.Name + ")";
                             }
                         })
                     }
                     return tl;
                 };

                 if (li.length > 1) {

                     if (obj.Name == li[(j + 1) % (li.length)].Name) {
                         var newoo = li[(j + 1) % (li.length)];
                         var all = [obj, newoo]
                         if (obj.Name == li[(j + 2) % (li.length)].Name) {
                             all.push(li[(j + 2) % (li.length)])
                         }
                         if (obj.Name == li[(j + 3) % (li.length)].Name) {
                             all.push(li[(j + 3) % (li.length)])
                         }
                         if (obj.Name == li[(j + 4) % (li.length)].Name) {
                             all.push(li[(j + 4) % (li.length)])
                         }
                         all.forEach(function (y, u) {
                             y.Name = y.Name + ' ' + override(y);
                         })

                     }

                     spanner.append('text').text(' ' + obj.Name + '')

                 } else {
                     spanner.append('text').text(' ' + obj.Name + '')
                 }

             }
             ogo = obj;
         })

     };

     var bod = leftdiv;

  addAccordion(mainlist, bod, 1)
     mainPages();

 });

 function entryText() {
     var entryText = `<p class="graytext">Welcome to the Dynamo Dictionary, a searchable database for Dynamo functionality. Here you can find explanations for nodes, sample files, and links to more information on associated workflows.  This site is constantly evolving as the community continues to add more information.

    Like the <a href="http://dynamoprimer.com/" target="_blank">Dynamo Primer</a>, this dictionary is open-source - check it out on our <a href="https://github.com/DynamoDS/DynamoDictionary" target="_blank">Github page</a> and contribute!</p>`;

     d3.select(".nodeDesc").append("html").html(entryText).append('html').html("<br><hr>")
 }

 function mainPages() {
     
     entryText();

     var imdiv = rightdiv.append("div").attr("class", "imageTiles").style("margin-left", "3%").style("margin-right", "1%")

     orderedList.forEach(function (d, i) {
         var image = getImagePath(d)
         var newim=(d3.select(".copy"+i)[0][0].cloneNode(true))
         var tile = imdiv.append("span").attr("class","sp"+i);
         var theimage=tile[0][0].appendChild(newim)
         theimage.className="im"+i;
         d3.select(".im"+i).attr("class", "im im" + i + "").attr("height", 30).attr("width", 30).data([d]).enter()
         })
         
         d3.selectAll(".seeAlso").html("<b>Nodes</b><br><br>");


             d3.selectAll(".imageTiles")
                 .selectAll("img")
             .on("mouseover", function (d, j) {
                     d3.select(this).style("background-color", "steelblue")

                     d3.select(".addedText" + j).style("color", "steelblue")
                     if (matrify == true) {
                         var tname = "<b>Node:&nbsp&nbsp</b>" + d.Name + "<br><br>";

                         if (d3.select(".nodeName").selectAll("text").text() == "Welcome to the Dynamo Dictionary!") {
                             tname = "<b>Node:&nbsp&nbsp</b>" + d.Name + "<br><br>";
                         }
                         d3.selectAll(".seeAlso").html(tname);
                     }
                 })
                 .on("mouseout", function (d, j) {
                     d3.select(".addedText" + j).style("color", "white")
                     d3.select(this).style("background-color", d3.rgb(34, 34, 34))

                     tname = "<b>Nodes</b><br><br>";
                     if (d3.select(".nodeName").selectAll("text").text() == "Welcome to the Dynamo Dictionary!") {

                     }

                     if (related.length > 0) {

                         d3.selectAll(".seeAlso").html("<b>See Also</b><br><br>");

                     } else {

                         d3.selectAll(".seeAlso").html("");
                     }
                     if (nodelevel == false) {
                         d3.selectAll(".seeAlso").html("<b>Nodes</b><br><br>");

                     }
                 })
                 .on("click", function (d) {
                     d3.select(this).style("background-color", d3.rgb(34, 34, 34))
                     wfalse = true;
                     
                     if (d.FullCategoryName != undefined) {
                         nodelevel = true;
                     } else {
                         related = [];
                         nodelevel = false;
                     }
                     var theb = testNodeButton(d)

                     $('.right-element').scrollTop(0);

                     theb.click();
                 });

             d3.selectAll("#wait").transition().duration(800).style("opacity", 0).delay(800).style("pointer-events", "none")


 }

 function getImagePath(ob) {

     var image = 'images\\' + ob.SmallIcon;
     var splitter = image.split("src");
     if (splitter.length < 2) {
         image = "images/src/icon_offset.png";
     }
     return image;
 }

 function updateInfo(ob) {

     d3.select(".nodeName").html()

     var descript = d3.select(".nodeName")
     descript.select('text').html('' + ob.Name + '<hr>')

     d3.selectAll(".imageTiles").selectAll("img").attr("width", 0)
     d3.selectAll(".addedText").remove();
     if (rightdiv.style("opacity") > 0) {
         rightdiv.style("opacity", 0).transition().duration(800).style("opacity", 1).transition().duration(800)
     }

     addInputs("Inputs", ".nodeIn", "ins", true)
     addInputs("Outputs", ".nodeOut", "outs", false)

     function addInputs(prop, clas, clas2, hasname) {
         if (ob[prop] != undefined) {

             d3.select(clas).html("<br><b>" + prop + ":</b></br>")

             ob[prop].forEach(function (t, r) {
                 if (hasname == true) {
                     d3.select(clas).append("text").attr("class", clas2).html('<b>' + t.Name + ':</b>&nbsp' + t.Type + '<br>').style("color", "gray")
                 } else {
                     d3.select(clas).append("text").attr("class", clas2).html('<b>Type:</b>&nbsp' + t.Type + '<br><br>').style("color", "gray")
                 }
             })
         } else {
             d3.select(clas).html("")
         }
     }

     d3.select(".nodeDesc").html("<br><b>Description:</b><br>&nbsp&nbsp  ").append("text").text(ob.Description).style('color', 'gray').append('html')

     d3.select(".nodeHier").html("<b>Dynamo Hierarchy:</b><br>&nbsp&nbsp")
     hierarchize(ob);

     var rand = Math.random();

     var hit = false;
     var hitob = {};

     function arraysEqual(a, b) {
         if (a === b) return true;
         if (a == null || b == null) return false;
         if (a.length != b.length) return false;

         for (var i = 0; i < a.length; ++i) {
             if (a[i] !== b[i]) return false;
         }
         return true;
     }

     inDepthObj.nodes.forEach(function (j, h) {
         if (ob.Name == j.Name && arraysEqual(ob.Categories, j.categories)) {
             hit = true;
             hitob = j;
         }
     })
     if (hit == true) {
         var iconimage1 = "images/icons/download.svg";
         var iconimage2 = "images/icons/edit.svg";
         var iconimage3 = "images/icons/add.svg";
         d3.select(".inDepth").html("<b><br>In Depth:</b>&nbsp&nbsp")
             .append("img").attr("hspace", 2).attr("width", "20px").attr("src", iconimage2).style("opacity", .25)
             .on("mouseover", function () {
                 d3.select(this).style("opacity", 1);
                 d3.select("body").style("cursor", "pointer");
             })
             .on("mouseout", function () {
                 d3.select(this).style("opacity", .25);
                 d3.select("body").style("cursor", "default");
             })
             .on("click", function () {
                 alert("functionality not yet available.")

             })
         var strr = hitob.inDepth;

         d3.select(".inDepth").append("html").html("&nbsp&nbsp").append("text").text(strr).style("color", "gray").append('html').html("<br><br><hr><br>")

         d3.select(".exampleFile").html("<hr><br><b>Example File:</b>&nbsp&nbsp&nbsp")
             .append("img").attr("hspace", 2).attr("width", "20px").attr("src", iconimage2).style("opacity", .25)
             .on("mouseover", function () {
                 d3.select(this).style("opacity", 1);
                 d3.select("body").style("cursor", "pointer");
             })
             .on("mouseout", function () {
                 d3.select(this).style("opacity", .25);
                 d3.select("body").style("cursor", "default");
             })
             .on("click", function () {
                 alert("functionality not yet available.")
             })
         d3.select(".exampleFile")
             .append("img").attr("hspace", 1).attr("width", "20px").attr("src", iconimage3).style("opacity", .25)
             .on("mouseover", function () {
                 d3.select(this).style("opacity", 1);
                 d3.select("body").style("cursor", "pointer");
             })
             .on("mouseout", function () {
                 d3.select(this).style("opacity", .25);
                 d3.select("body").style("cursor", "default");
             })
             .on("click", function () {
                 alert("functionality not yet available.")
             })
         d3.select(".exampleFile")
             .append("img").attr("hspace", 6).attr("width", "20px").attr("src", iconimage1).style("opacity", .25)
             .on("mouseover", function () {
                 d3.select(this).style("opacity", 1);
                 d3.select("body").style("cursor", "pointer");
             })
             .on("mouseout", function () {
                 d3.select(this).style("opacity", .25);
                 d3.select("body").style("cursor", "default");
             })
             .on("click", function () {

                 var fp = hitob.folderPath;
                 var dl = "./data/EXAMPLES/" + fp + "/dyn/" + hitob.dynFile[0] + ".dyn";

                 var linker = $('<a href="' + dl + '" id="dl" download></a>').appendTo('body').click();
                 document.getElementById('dl').click();
             })
         var impaths = hitob.imageFile;
         impaths.forEach(function (z, v) {
             var fp = hitob.folderPath;
             var imp = "./data/EXAMPLES/" + fp + "/img/" + z + ".jpg";
             d3.select(".exampleFile").append('html').html("<br>").append("img").attr("src", imp).attr("width", "80%").attr("align", "middle")
         })

     } else {
         d3.select(".inDepth").html("")
         d3.select(".exampleFile").html("")
     }

     tl = (ob.SearchTags.split(','))

     related = [];

     if (tl != "") {
         tl.forEach(function (h, j) {
             allData.forEach(function (d, i) {
                 var s = (d.SearchTags.split(','))
                 if (s != "") {
                     for (var l = 0; l < s.length; l++) {
                         var k = s[l];
                         if (k.toUpperCase() == h.toUpperCase()) {
                             if (!_.isEqual(ob, d)) {
                                 var dup = false;
                                 if (related.length == 0) {
                                     related.push(d)
                                 } else {
                                     related.forEach(function (y, z) {
                                         if (_.isEqual(y, d)) {
                                             dup = true;
                                         }
                                         if (z == related.length - 1) {
                                             if (dup == false) {
                                                 related.push(d);
                                             }
                                         }
                                     })
                                 }

                             }
                         }
                     }

                 }

             })
         })
     }
     

     if (related.length > 0) {
         d3.selectAll(".seeAlso").html("<b>See Also</b><br><br>");
     } else {
         d3.selectAll(".seeAlso").html("");
     }
     d3.selectAll(".seeAlso").append("html")
     var ims = d3.selectAll(".imageTiles").selectAll("img")
     var imcount = [];

     ims[0].forEach(function (q, w) {
         var qq = d3.select(q).data()[0];
         var hit = false;
         if (related.length == 0) {
             imageDeactivate(q, w, 800);
         }
         related.forEach(function (t, u) {
             if (_.isEqual(qq, t)) {
                 hit = true;
                 imageActivate(q, w, 800);
             }
             if (u == (related.length - 1) && hit == false) {
                 imageDeactivate(q, w, 800);
             }
         })

     })
     tilize();

 }

 function hierarchize(ob) {
     var lili = [];
     ob.Categories.forEach(function (h, j) {
         lili.push(h)
     })
     lili.push(ob.Group);
     addHierarchy(lili)

 }

 function addHierarchy(lili) {
     lili.forEach(function (e, f) {
         var ttt = "";
         var color = "gray";
         if (f == 0) {
             if (f != lili.length - 1) {
                 ttt = " " + e + " > ";
             } else {
                 ttt = " " + e + " ";
             }
         } else if (f < lili.length - 1) {
             ttt = e + " > ";
         } else {
             ttt = e;
         }
         if (f == 0) {
             var catt = d3.select(".nodeHier").append('span').text(" Home > ").style("color", "gray")
                 .on("click", function () {
                     goHome();
                     related = [];
                     nodelevel = false;
                     d3.select('body').style("cursor", "default")

                 })
                 .on("mouseover", function () {
                     d3.select('body').style("cursor", "pointer")
                     d3.select(this).style("color", "white")
                     d3.select(this)
                 })
                 .on("mouseout", function () {
                     d3.select('body').style("cursor", "default")
                     d3.select(this).style("color", "gray")
                 })
         }
         var catt = d3.select(".nodeHier").append('span').text(ttt).style("color", "gray")
             .on("click", function () {
                 related = [];
                 nodelevel = false;
                 wfalse = true;
                 var bbb = testButton(lili, e, f)

                 bbb.click();
                 d3.select('body').style("cursor", "default")

             })
             .on("mouseover", function () {
                 d3.select('body').style("cursor", "pointer")
                 d3.select(this).style("color", "white")
                 d3.select(this)
             })
             .on("mouseout", function () {
                 d3.select('body').style("cursor", "default")
                 d3.select(this).style("color", "gray")
             })

         if (f == lili.length - 1) {
             catt.append('html')
         }

     })
 }
