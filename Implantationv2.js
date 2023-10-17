////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var start_row=8    // row on the sheet where to start calculation
var start_col=21    //col on the sheet where to start
var stores_num=32   //fixed number of stores

var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('allocation_modeling_DK');

var toShares=[]
  toShares=sheet.getRange(4, start_col, 1, stores_num).getValues(); //getRange(starting Row, starting column, number of rows, number of columns)
var toSharesValues=[]   //converted to 1D Array of shares

for (var n=0; n<stores_num; n=n+1) {
      toSharesValues[n]=toShares[0][n];
  }

var wCoverage=[]

  wCoverage=sheet.getRange(6, start_col, 1, stores_num).getValues(); //getRange(starting Row, starting column, number of rows, number of columns)
var wCoverageParam=[]   //converted to 1D Array of shares

for (var n=0; n<stores_num; n=n+1) {
      wCoverageParam[n]=wCoverage[0][n];
  }
//Logger.log(wCoverageParam);

var lastRow = sheet.getLastRow();
var lastColumn=sheet.getLastColumn();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function myImplantationComplex() {

/////////////Start of cycle for processing all rows

for (var r=start_row; r<100+1; r=r+1) {

  var insertRange = sheet.getRange(r,start_col,1,32);    //getRange(starting Row, starting column, number of rows, number of columns)

Logger.log(r);

var onhandStock=sheet.getRange(r,11).getValue();    //get stock on hand
var sales2W=sheet.getRange(r,13).getValue();       //get 2W sales number
var sales3W=sheet.getRange(r,14).getValue();       //get 3W sales number
var sales4W=sheet.getRange(r,15).getValue();       //get 4W sales number
var sales5W=sheet.getRange(r,16).getValue();       //get 5W sales number
var seasonType=sheet.getRange(r,5).getValue();    //get type of Season 1-Annual, 2-Summer, 3-Winter 

var minSupply=[];
var limitedSupply=[];
var limitedSupply2D=[];

var prioSupply=[];
var totalSupply=[];
var stockRemainder=[];

//Logger.log(onhandStock);

if (onhandStock>32) {       //If we can send 1 and more to all

    for (var n=0; n<stores_num; n=n+1) {    //distribute 1 to everyone
      minSupply[n]=1;}

  remainingQty=onhandStock-32                    //then work with the remainder
  residual=remainingQty

//Logger.log(residual);


    for (var n=0; n<stores_num; n=n+1){
        if(residual>0){
          if(wCoverageParam[n]==5) {prioSupply[n]=sales5W*toSharesValues[n];}
          else if (wCoverageParam[n]==4) {prioSupply[n]=sales4W*toSharesValues[n];}
          else if (wCoverageParam[n]==3) {prioSupply[n]=sales3W*toSharesValues[n];}
          else if (wCoverageParam[n]==1) {
              if(seasonType==3){prioSupply[n]=sales3W*toSharesValues[n];}
              else {prioSupply[n]=sales4W*toSharesValues[n];}}
          else if (wCoverageParam[n]==2) {
              if(seasonType==2){prioSupply[n]=sales2W*toSharesValues[n];}     
              else {prioSupply[n]=sales3W*toSharesValues[n];}}
            residual=residual-prioSupply[n]
            }      
      else{prioSupply[n]=0;}}

var sumPrio=0
    for (var n=0; n<stores_num; n=n+1) {
        sumPrio=sumPrio+prioSupply[n]
      }


//Logger.log(prioSupply);
//Logger.log(sumPrio);
//Logger.log(residual);

k=0
    if (residual<0){
      for (var n=stores_num-1; n>=0; n=n-1) {
      if(k<1){
          if(prioSupply[n]>0) {prioSupply[n]=prioSupply[n]+residual;
          k=k+1}
      }
      }
    }
//Logger.log(prioSupply);


    for (var n=0; n<stores_num; n=n+1){
    totalSupply[n]=Math.round(prioSupply[n])+minSupply[n];
    }
//Logger.log(totalSupply);

var sumTotalSupply=0
    for (var n=0; n<stores_num; n=n+1) {
        sumTotalSupply=sumTotalSupply+totalSupply[n]
      }
//Logger.log(sumTotalSupply);


shareRemStock=0
shareRemStock=(onhandStock-sumTotalSupply)/onhandStock;

//Logger.log(shareRemStock);

      var totalSupply2D = new Array(1);
      totalSupply2D[0] = new Array(32);

      for (var n=0; n<stores_num; n=n+1) {
      totalSupply2D[0][n]=totalSupply[n]}

   if(shareRemStock>0.2){insertRange.setValues(totalSupply2D);}     //If more than 20% from Initial stock left at WH stop here and output the result
  else {                                                                //If 20% or less left continue allocation
    bonusPortion=0
    roundRemainder=0
    bonusPortion=Math.floor((onhandStock-sumTotalSupply)/10)      //number of stores in the First group
    roundRemainder=(onhandStock-sumTotalSupply)-bonusPortion*10

//  Logger.log(bonusPortion);
//  Logger.log(roundRemainder);

    x=0 
        for (var n=0; n<stores_num; n=n+1){
           
            if(wCoverageParam[n]==5){
              if(x==roundRemainder){stockRemainder[n]=bonusPortion;}
              else if(x<roundRemainder){
                    stockRemainder[n]=bonusPortion+1;
                    x=x+1}
            }else{stockRemainder[n]=0;}
           
        }
 

      for (var n=0; n<stores_num; n=n+1){
        totalSupply2D[0][n]=totalSupply2D[0][n]+stockRemainder[n];
      }
//Logger.log(totalSupply2D);
      insertRange.setValues(totalSupply2D);
      }

  



}else{                                     //If we cannot send even 1 to all, distribute 1ea according to rank

      
      var limitedSupply2D = new Array(1);
      limitedSupply2D[0] = new Array(32);

      for (var n=0; n<stores_num; n=n+1) {
      if(n<onhandStock) {limitedSupply[n]=1;}
      else {limitedSupply[n]=0}
      }
    
    for (var n=0; n<stores_num; n=n+1) {
      limitedSupply2D[0][n]=limitedSupply[n]}

    insertRange.setValues(limitedSupply2D);
    
    }






}
}
