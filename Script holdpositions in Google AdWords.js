function main() {
  //масив ярлыков.
  //Если один то просто строчка типа "Ярлик1".
  //Если массив, то ["Ярлик1","Ярлик2",...,"ЯрликN"]
  var LabelNames = [""];
  //максимально допустимая цена за клик
  var maxPrice = 25.00;
  //минимально допустима цена за клик
  var minPrice = 0.1;
  //нижняя граница базового диапазона AveragePosition
  var customLowerAveragePosition = 1;
  //верхня граниа базового диапазона AveragePosition
  var customUpperAveragePosition = 1.5;
  //проценты для базового диапазона
  var customPercent = 0;
  //(%)шаг для процентов других диапазонов
  var stepPercent = 5;
  //найменшее возможное значенне AveragePosition
  var minAveragePosition = 1;
  //наибольшее возможное значенне AveragePosition
  var maxAveragePosition = 10;
  //diapason
  var diapason = 0.5;


  var tempPercent = customPercent;
  var down_max = customLowerAveragePosition;
  var down_min = down_max - diapason;

  var up_min = customUpperAveragePosition;
  var up_max = up_min + diapason;

  var to_up = maxAveragePosition - customUpperAveragePosition;

  var labelName = "";
  if(LabelNames.constructor === Array){
    labelName = "LabelNames CONTAINS_ANY ['" + LabelNames.join("','") + "']";
  }else{
    labelName = "LabelNames = '" + LabelNames + "'";
  }
  Logger.log("Condition for labels: " + labelName);

  var selectedKeyword = 0;
  while(down_max > minAveragePosition){
    Logger.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    tempPercent = tempPercent - stepPercent;
    var keywordIterator = AdWordsApp.keywords()
    .withCondition(labelName)
    .withCondition("AveragePosition < " + Number(down_max) + " AND AveragePosition > " + Number(down_min - 0.01))
    .withCondition("Impressions > 0")
    .forDateRange("YESTERDAY")
    .get();
    Logger.log(" AveragePosition < " + Number(down_max) + " AND AveragePosition > " + Number(down_min - 0.01));
    while(keywordIterator.hasNext()){
      selectedKeyword = selectedKeyword + 1;
      Logger.log("   ---------------");
      var keyword = keywordIterator.next();
      Logger.log("   " + selectedKeyword + "   ----------- keyword: " + keyword.getText());
      Logger.log("   old price " + keyword.getMaxCpc());
       var tempPrice = keyword.getMaxCpc() + (keyword.getMaxCpc() * tempPercent)/100;
       if (tempPrice > maxPrice) {
         keyword.setMaxCpc(maxPrice);
       }else if (tempPrice < minPrice){
         keyword.setMaxCpc(minPrice);
       }else{
         keyword.setMaxCpc(tempPrice);
       }
       Logger.log("   new price " + keyword.getMaxCpc());
       Logger.log("   add percent " + tempPercent);
     }
    down_max = down_min - 0.01;
    down_min = down_max - diapason;
  }

  tempPercent = customPercent;

  while(up_min < maxAveragePosition){
    Logger.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    tempPercent = tempPercent + stepPercent;
    var keywordIterator = AdWordsApp.keywords()
    .withCondition(labelName)
    .withCondition("AveragePosition < " + Number(up_max) + " AND AveragePosition > " + Number(up_min-0.01))
    .withCondition("Impressions > 0")
    .forDateRange("YESTERDAY")
    .get();
    Logger.log(" AveragePosition < " + Number(up_max) + " AND AveragePosition > " + Number(up_min-0.01));
     while (keywordIterator.hasNext()){
       selectedKeyword = selectedKeyword + 1;
       Logger.log("   ---------------");
       var keyword = keywordIterator.next();
       Logger.log("   " + selectedKeyword + "   ------------------keyword " + keyword.getText());
       Logger.log("   old price " + keyword.getMaxCpc());
       var tempPrice = keyword.getMaxCpc() + (keyword.getMaxCpc() * tempPercent)/100;
       if (tempPrice > maxPrice) {
         keyword.setMaxCpc(maxPrice);
       }else if (tempPrice < minPrice){
         keyword.setMaxCpc(minPrice);
       }else{
         keyword.setMaxCpc(tempPrice);
       }
       Logger.log("   new price " + keyword.getMaxCpc());
       Logger.log("   add percent " + tempPercent);
     }

    up_min = up_max;
    up_max = up_max + diapason;
  }


}
