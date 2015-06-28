var csv = require('csv');
var exec = require('child_process').exec;

var zip = '3001626';//調べたい郵便番号

//入出力ファイル 08IBARAK.CSVから08IBARAK-utf8.CSVを作る
var infile = __dirname+'/08IBARAK.CSV';
var outfile = __dirname+'/08IBARAK-utf8.CSV';

//iconvコマンド
var cmd = 'iconv -f SHIFT_JIS -t UTF-8 -o '+outfile+' '+infile+'';

//文字コード変換 入力ファイルをUTF-8へ変換して出力後CSV処理起動
var child = exec(cmd,
  function (error, stdout, stderr) {
    getCSV();//CSV処理起動
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});

//CSV処理
function getCSV(){
  console.time('bench');
  csv()
    .fromPath(outfile) //読み込むCSVファイル
    .transform(function(data){//絞り込みと変換加工処理
      if(data[2]===zip){
        data[8]=
          data[8]
            .replace('以下に掲載がない場合','')
            .replace('境町の次に番地がくる場合','')
        return data[2]+ ' ' +data[6] +data[7] +data[8];
      }
    })
    .on('data',function(data){
      console.log(data);//変換後のデータを受け取り表示
      console.timeEnd('bench');
    })
    .on('end',function(count){
        console.log('Number of lines: '+count);
    })
    .on('error',function(error){
        console.log(error.message);
    }) 
}
