////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var start_row=8   // row on the sheet where to start calculation
var start_col=21    //col on the sheet where to start
var stores_num=32   //fixed number of stores

var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('allocation_modeling_DK');


var wCoverage=[]

  wCoverage=sheet.getRange(6, start_col, 1, stores_num).getValues(); //getRange(starting Row, starting column, number of rows, number of columns)
var wCoverageParam=[]   //converted to 1D Array of shares

for (var n=0; n<stores_num; n=n+1) {
      wCoverageParam[n]=wCoverage[0][n];
  }

var lastRow = sheet.getLastRow();
var lastColumn=sheet.getLastColumn();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function myMiniMerch() {

/////////////Start of cycle for processing all rows

for (var r=start_row; r<lastRow+1; r=r+1) {

var insertRange = sheet.getRange(r,start_col,1,stores_num);    //getRange(starting Row, starting column, number of rows, number of columns)

Logger.log(r);

var whStock=sheet.getRange(r,18).getValue();    //get remaining WH stock
var vykladka=sheet.getRange(r,1).getValue();    //read Vykladka

miniMerch=0

if(vykladka=="полка-лежит" || vykladka=="корзинка"){miniMerch=1;}

//Logger.log(miniMerch);

if(miniMerch==1 && whStock>0){

    var totalSupply=[];

    totalSupply=sheet.getRange(r, start_col, 1, stores_num).getValues(); //getRange(starting Row, starting column, number of rows, number of columns)
    var totalSupplyValues=[]   //converted to 1D Array of shares

    for (var n=0; n<stores_num; n=n+1) {
          totalSupplyValues[n]=totalSupply[0][n];
      }
    //Logger.log(totalSupplyValues);

    var sumSupply=0
    for (var n=0; n<stores_num; n=n+1) {
        sumSupply=sumSupply+totalSupplyValues[n]
      }
    //Logger.log(sumSupply);

    residual=whStock;

    for (var n=0; n<stores_num; n=n+1) {
        if(wCoverageParam[n]==5||wCoverageParam[n]==4||wCoverageParam[n]==1){
          if(totalSupplyValues[n]==1){
            if(residual>0){
              totalSupplyValues[n]=totalSupplyValues[n]+1;
              residual=residual-1
            }
          }
        }


    }
    //Logger.log(totalSupplyValues);
    var sumSupplyAfter=0
    for (var n=0; n<stores_num; n=n+1) {
        sumSupplyAfter=sumSupplyAfter+totalSupplyValues[n]
      }
    //Logger.log(sumSupplyAfter);

    if((sumSupplyAfter-sumSupply)>0) {                                  //if there`s a change, then replace with new numbers

      var totalSupply2D = new Array(1);
      totalSupply2D[0] = new Array(32);

      for (var n=0; n<stores_num; n=n+1) {
      totalSupply2D[0][n]=totalSupplyValues[n]}

      insertRange.setValues(totalSupply2D);

    }
}


}
}