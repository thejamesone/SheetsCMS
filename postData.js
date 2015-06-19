
    
    
      window.onload = function() { init(); };
      
      var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1CsOvuTXnCI4RM0TB-GO4phBXF1omxEXvpRTBYiqf3A8/pubhtml';
      
      function init() {
        Tabletop.init( { key: public_spreadsheet_url,
                         debug : false,
                         callback: showInfo,
                         simpleSheet: false } );
      }
      
      function showInfo(data, tabletop) {
    
        
        //call the function that reads the names of the sheets and turns them into menu items
        menu_populate(tabletop, data);
        
     
        //tabletop and data are required by function, Sheet Name, Column Name(leave off to pull back entire sheet)
        post_data(tabletop, data, [tabletop.foundSheetNames[0]]);
        
 
        // querySelector, jQuery style
        var $ = function (selector) {
          return document.querySelector(selector);
        }; 
          
        var menuItem = document.getElementsByClassName("menu-item")[0];
        var page = document.getElementById("page");
        var links = $('.menu-items').getElementsByClassName('menu-item');
       
        
        for (var i = 0; i < links.length; i++) {
          var sheetName = tabletop.foundSheetNames[i];
          menuLink(tabletop, data, i, sheetName);
        }
        
        function menuLink(tabletop, data, i, sheetName){
          document.getElementsByClassName("menu-item")[i].addEventListener('click', function(){menuClick(tabletop, data, sheetName);});
          document.getElementsByClassName("block")[i].addEventListener('click', function(){
            menuClick(tabletop, data, sheetName);});
        }

          function menuClick (tabletop, data, sheetName){
             console.log(tabletop);
             console.log(data);
            page.innerHTML = "<div id=\"container\"></div>"; 
            post_data(tabletop, data, [sheetName]); 
            document.getElementById("main-content").scrollTop = 0;
          }

      }
      
       function menu_populate(tabletop, data){
         
          //create the <paper-menu> element 
          var menu = "<paper-menu class=\"list\"><iron-selector selected=\"0\" class=\"menu-items\"></paper-menu>";
          var section = document.getElementsByClassName("horizontal-section")[0];
          section.innerHTML = section.innerHTML + menu;
         
        
       for (i = 0; i < tabletop.foundSheetNames.length; i++) {
         
          //TODO: Is this way better then concatanating the html? I'm just going to leave it here for now. 
          //
          //var textnode  = document.createTextNode([tabletop.foundSheetNames[i]]);
          //var link = document.createElement("paper-item");
          //link.appendChild(textnode);
          //link.id = [tabletop.foundSheetNames[i]]
          //document.getElementsByClassName("list")[0].appendChild(link);
          
          //Populate the <paper-menu> with <paper-item> containing the Sheet Names.
          var sheetName = tabletop.foundSheetNames[i];
          var icon =  tabletop.sheets(sheetName).all()[0]["Favicon"];
          var link = "<paper-item class=\"menu-item\"><paper-icon-button src=" + icon + "></paper-icon-button>" + sheetName + "</paper-item>";
          var list = document.getElementsByClassName("menu-items")[0];
          list.innerHTML = list.innerHTML + link;
          
          
          //populate the Read Next section in the footer
          content = tabletop.sheets(sheetName).all()[0]["Abstract"];
          var footerBlockTitle = "<h3 class=\"block-title\">" + sheetName + "</h3>";
          var footerBlockAbstract = "<p class=\"block-abstract\">" + content + "</p>";
          
          
          if (!content){
            content = tabletop.sheets(sheetName).all()[0]["Body"];
            footerBlockAbstract = "<p class=\"block-abstract\">" + content + "</p>";
          }
          
          var footer = document.getElementById("footerContainer");
          footer.innerHTML = footer.innerHTML + "<div class=\"block\">" + footerBlockTitle + footerBlockAbstract +  "</div>";
          
        }
       }
       
       
       
       
       
         function post_data(tabletop, data, sheet, content) {
       
        var element = "div";
        var page = document.getElementById("page");
        var container = document.getElementById("container");
        //count all the rows in sheet
        console.log(sheet);
        row_count = tabletop.sheets(sheet).column_names.length;
        
        for (i = 0; i < row_count; i++){
          
            //if content included then skip iterator
       if (!content){
          
          var current_col = tabletop.sheets(sheet).column_names[i];
          content = "";
          
          var col_length = current_col.length;
          var end_number = current_col[col_length-1];
          var id = "";
          
          
          var type = current_col[0] + current_col[1] + current_col[2];
          
          switch (type){
            case "Sub":
              content = "Subhead";
              element = "h2";
              break;
            case "Div":
              content = "Divider";
              element = "hr";
              break;
            case "Tit":
              content = "Title";
              element = "h1";
              break;
            case "Ima":
              content = "Image";
              element = "iron-image";
              break;
            case "Vid":
              content = "Video";
              element = "video";
              break;
            case "Abs":
              content = "Abstract";
              element = "p";
              break;
            case "Bod":
              content = "Body";
              element = "p";
              break;
            case "Pul":
              content = "Pullquote";
              element = "blockquote";
              break;
            case "Blo":
              content = "Blockquote";
              element = "blockquote";
              break;
          }
          
          id = content;
          
          if (isNaN(end_number) === false){
            
            content = content + end_number;
            
          }
          
          
          
       }else {i = row_count;}
          
          /*
          //select the cell and make it into a node
          var textnode = document.createTextNode(tabletop.sheets(sheet).all()[0][content]);
          //create a DOM element and apply cell data to it
          var element_dom = document.createElement(element);
          element_dom.id=[content];
          
          if (current_col == "Image"){
            element_dom.width="100%";
            element_dom.height="400px";
            element_dom.sizing="cover";
            element_dom.src=tabletop.sheets(sheet).all()[0][content];
            page.appendChild(element_dom);
            
          }else{
        
            element_dom.appendChild(textnode);
            page.appendChild(element_dom);
          
          }
          */
          if(type == "Div") {
            var element_dom = "<"+ element + " class=\"section-divider\"" + "></" + element + ">";
            container.innerHTML = container.innerHTML + element_dom;
          }
          
          if (!tabletop.sheets(sheet).all()[0][content]) {
            content = "";
          }else{
          
          
          if (type == "Ima"){
            var element_dom = "<"+ element + " id=\"" + [id] + "\"" + " style=\"width:100%; height:506px;\" sizing=\"cover\" src=\"" + tabletop.sheets(sheet).all()[0][content] + "\">";
            container.innerHTML = container.innerHTML + element_dom;
            if (!tabletop.sheets(sheet).all()[1][content]){}else{
            var caption = "<figcaption>" + tabletop.sheets(sheet).all()[1][content] + "</figcaption>";
            container.innerHTML = container.innerHTML + caption;
            }
          }else{
            var element_dom = "<"+ element + " class=\"" + [id] + "\"" + ">" + tabletop.sheets(sheet).all()[0][content] + "</" + element + ">";
            container.innerHTML = container.innerHTML + element_dom;
          }
       
          content = "";
          
          //set the first image as a header image. 
          var firstImg = document.getElementsByTagName("iron-image")[0];
          firstImg.id = "HeaderImage";
          page.insertBefore(firstImg, page.firstChild);
          
         // var menu = document.getElementsByTagName("paper-toolbar")[0];
         //page.insertBefore(menu, page.firstChild);
          }
           
          }
      }
       
    
