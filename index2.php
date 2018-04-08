<!DOCTYPE html>
<html>
<head>
  <title></title>
  <meta charset="UTF-8">
  <script type="text/javascript">
    var exampleSocket = new WebSocket("ws://39.108.12.198:9501");
    exampleSocket.onopen = function (event) {
      exampleSocket.send('{"action":"login","userid":"u2"}');
      // 监听消息
      exampleSocket.onmessage = function (event) {
        console.log(event.data);
      };
      // 监听Socket的关闭
      exampleSocket.onclose = function (event) {
        console.log('Client notified socket has closed', event);
      };
    };
  </script>
</head>
<body>
<input type="text" id="content" style="width: 500px">
<button onclick="exampleSocket.send( document.getElementById('content').value )">发送</button>
</body>
</html>