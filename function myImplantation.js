function myImplantation() {

    var stores_num=33 //fixed number of stores
    
    var minSupply=[];
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('allocation_modeling');
    
    var toShares=[]
      toShares=sheet.getRange(3, 10, 1, 33).getValues(); //getRange(starting Row, starting column, number of rows, number of columns)
    var toSharesValues=[]
    
    for (var n=0; n<stores_num; n=n+1) {
          toSharesValues[n]=toShares[0][n];
      }
    
    var lastRow = sheet.getLastRow();
    var lastColumn=sheet.getLastColumn();
    
    for (var r=7; r<lastRow+1; r=r+1)   { //start of rows
    
    
    var impQty=sheet.getRange(r,9).getValue();
    
    Logger.log(r)
    
    var prioSupply=[]
    var prioSupplyRounded=[]
    var prioRemainder=[]
    var limitedSupply=[]
    var limitedSupplyRounded=[]
    
     if ((impQty/stores_num)>=1) {                //If we can send 1 or more to all
    
          for (var n=0; n<stores_num; n=n+1) {    //distribute 1 to everyone
          minSupply[n]=1;}
    
        remainingQty=impQty-33                    //then work with the remainder
    
    
          for (var n=0; n<stores_num; n=n+1) {
          prioSupply[n]=remainingQty*toSharesValues[n];
          prioSupplyRounded[n]=Math.round(remainingQty*toSharesValues[n])}      //Rounded prioSupply quantities
    
        var sumPrio=0
          for (var n=0; n<stores_num; n=n+1) {
            sumPrio=sumPrio+prioSupplyRounded[n]
          }
        qtyAdd=remainingQty-sumPrio               // number of stores to RoundUP
    
        k=0                                       //adding 1 to not rounded store according priority
            for (var n=0; n<stores_num; n=n+1) {
        
                if((prioSupply[n]-prioSupplyRounded[n])>0 ){
                  if(k<qtyAdd){
                  prioRemainder[n]=1;
                  k=k+1}
                  else {prioRemainder[n]=0}
               } else {prioRemainder[n]=0}
        }
     }else {                                     //If we cannot send even 1 to all
    
          for (var n=0; n<stores_num; n=n+1) {
          limitedSupply[n]=impQty*toSharesValues[n];
          limitedSupplyRounded[n]=Math.round(impQty*toSharesValues[n])}
    
     }
    
      totalSupply=[]
      totalSupply2D=[]
    
        for (var n=0; n<stores_num; n=n+1){
          totalSupply[n]=minSupply[n]+prioSupplyRounded[n]+prioRemainder[n];
        }
    
       // for (var n=0; n<stores_num; n=n+1) {
       //   totalSupply2D[0][n]=totalSupply[n]}
       
        //create 2D array with just 1 row and m columns
        var totalSupply2D = new Array(1);
        totalSupply2D[0] = new Array(32);
    //fill it with values
       for(var j=0;j<33;j++){
            totalSupply2D[0][j]=totalSupply[j];
       }
    //send it to the spreadsheet
      //  sheet.getRange(n,1,1,arr.length).setValues(dataRow);
    
    var limitedSupply2D = new Array(1);
        limitedSupply2D[0] = new Array(32);
    //fill it with values
       for(var j=0;j<33;j++){
            limitedSupply2D[0][j]=limitedSupplyRounded[j];
       }
    
    
    
      var range = sheet.getRange(r,10,1,33);    //getRange(starting Row, starting column, number of rows, number of columns)
    
    if ((impQty/stores_num)>=1) {   
    
                
      range.setValues(totalSupply2D);}
      else
      {
    
      range.setValues(limitedSupply2D);
    
      }
            
    
    } 
    
    //Logger.log(toSharesValues);
    //Logger.log(minSupply);
    //Logger.log(remainingQty);
    //Logger.log(prioSupply);
    //Logger.log(prioSupplyRounded);
    //Logger.log(limitedSupply);
    //Logger.log(sumPrio);
    //Logger.log(prioRemainder);
    //Logger.log(totalSupply);
    //Logger.log(totalSupply2D);
    
    }