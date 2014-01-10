function test() {
    addTestSample("sample_1_1.png");
    addTestSample("sample_1_2.png");
    addTestSample("sample_1_3.png");
    addTestSample("sample_1_4.png");
}

function addTestSample(name) {
    $.ajax({
        url: "img/calculated/" + name + ".json",
        success: function (data) {
            if (typeof data == "string")
                data = JSON.parse(data);
            var img = new Image();
            img.src = data.prefix + data.image;
            img.onload = function () {
                APP.Samples.add({type: "img", img: img, layer: APP.Samples.length});
                APP.loading(false);
            };
        },
        error: function () {
            console.log("error!");
            console.log(arguments);
            APP.loading(false);
            APP.alert();
        }
    });
}