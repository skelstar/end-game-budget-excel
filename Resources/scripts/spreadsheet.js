
$(document).ready(function() {

    var numRows = 100;
    var numCols = 100;

    var selectedCol, selectedRow;

    selectedCol = 0;
    selectedRow = 0;

    formulas = [[numRows], [numCols]];
    
    drawSheet(numRows, numCols, formulas);		

    $('.cell').click( function(e) {
        var clickedCell= $(e.target);

        $('.cell').removeClass('selectedCell');
        clickedCell.addClass('selectedCell');
        
        selectedCol = getColumnCoords(clickedCell);
        selectedRow = getRowCoords(clickedCell);
        // select the address bar
        $('#formulaBar').focus();

        var value = formulas[selectedRow][selectedCol];

        if (value.startsWith("=SUM(")) {

        }
        else if (value.startsWith('=')) {
            $('#formulaBar').val(value.substring(1));
        }

        var colName = getColumnNameFromColumnNumber(selectedCol);
        var colNumber = getColumnNumberFromColumnName(colName);
        console.log(colName + " " + colNumber);
    });

    $('#formulaBar').keypress( function(e) {
        if (e.which == 13) {
            formulas[selectedRow][selectedCol] = "=" + e.target.value;
            e.preventDefault();
            $(this).val("");
            updateCell(selectedCol, selectedRow);
        }
    });

    function drawSheet(numberOfRows, numberOfCols) {
        
        var array = [];

        // for each row
        for (row=0; row<numberOfRows; row++) {

            var xArray = [];
            var headerStr = "<th class='rowHeader'></th>";

            var rowNumber = row+1;
            var rowStr = "<td class='rowHeader'>" + rowNumber + "</td>";
            
            // for each column
            for (col=0; col<numberOfCols; col++) {
                if (row === 0) {
                    headerStr += "<th class='columnHeader' coords='" + col + "'>" + getColumnNameFromColumnNumber(col) + "</th>";
                }
                rowStr += getCellHtml(col, row, xArray);
            }

            if (row == 0) {
                $(".spreadsheet > thead").html(headerStr);
            }
            
            $(".spreadsheet > tbody:last-child").append("<tr>" + rowStr + "</tr> \n");
            array.push(xArray);
        }
        formulas = array;
    }

    function getColumnNameFromColumnNumber(col) {
        var charCodeA = "A".charCodeAt(0);
        var val = "";

        var offset = Math.floor(col/26);

        if (offset == 0) {
            val = String.fromCharCode(charCodeA + col);
        } else {
            val = String.fromCharCode(charCodeA + offset - 1) + String.fromCharCode(charCodeA + (col-(26*offset)));
        }
        return val;
    }

    function getColumnNumberFromColumnName(colName) {
        var charCodeA = "A".charCodeAt(0);
        // this is a quick hack. It is not extensible/does not scale

        // (charCode(B)-charCodeA)+ (26*i)




        var colNum = 0;
        for (i=colName.length-1; i>=0; i--) {
            colNum += colName.charCodeAt(colName.length-i-1) - charCodeA + (26*i);	// ((colName.charCodeAt(i) - charCodeA) * i) + colName.charCodeAt(i) - charCodeA;
        }
        return colNum;
    }

    function getCellHtml(col, row, array) {
        var coords = getCoordsAttr(col, row);
        var val = " ";
        array.push("=" + val);
        return "<td class='cell' coords='" + coords + "'>" + val + "</td>";
    }

    function updateCell(col, row) {

        var value = formulas[row][col];

        if (value.startsWith('=SUM(')) {
            $("td[coords='" + getCoordsAttr(col, row) + "']").html("<em>SUM</em>");
        }
        else if (value.startsWith('=')) {
            $("td[coords='" + getCoordsAttr(col, row) + "']").html(value.substring(1));
        }
    }

    function getCoordsAttr(col, row) {
        return col + "|" + row;
    }

    function getColumnCoords(cell) {
        var coords = $(cell).attr("coords");
        return parseInt(coords.split("|")[0]);
    }

    function getRowCoords(cell) {
        var coords = $(cell).attr("coords");
        var splitStr = coords.split("|");
        if (splitStr.length > 0) {
            return parseInt(coords.split("|")[1]);	
        }
        return 0;
    }
});		