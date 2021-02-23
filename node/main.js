const net = require('net');

const pp = net.createConnection({ port: 64412, host: 'localhost'}, () => {
    console.log('Connecting to ProPresenter...');
    pp.write('<StageDisplayLogin>avteam</StageDisplayLogin>\r\n');
});

pp.on('data', (data) => {
    console.log(data.toString());
    // pp.end();
});

// app.listen(64412, 'localhost', function() {
//     // console.log("... port %d in %s mode", app.address().port, app.settings.env);
//     console.log("Connect?");
// });