'use strict';

(function (){
    if (window.dateParser)
        return;
    
    var symbols = ['d'];
    var functions = ['setDate'];
    
    var extractSymbolValues = function(dateStr,format){
        var result = {};
        for (var i = 0; i < format.length; i++){
            if (symbols.indexOf(format.charAt(i)) !== -1){
                if (!result[format.charAt(i)]){
                    result[format.charAt(i)] = [];
                }
                result[format.charAt(i)].push(dateStr.charAt(i))
            }
        }
        return result;
    };
    
    var createDate = function(symbolValues){
        var dateResult = new Date();
        for (var i = 0; i < symbols.length; i++){
            var symbolData = symbolValues[symbols[i]];
            if (symbolData){
                var value = parseInt(symbolData.join(''));
                dateResult[functions[i]](value);
            }  
        }
        return dateResult;
    };
    
    window.dateParser = {
        parseExact : function(dateStr,format){
            if (dateStr.length !== format.length)
                throw "Date " + dateStr + " length does not match format " + format + " length";
            var symbolValues = extractSymbolValues(dateStr,format);
            return createDate(symbolValues);
        }
    };
})();

