var loader_template = '<div class="loader"></div>'

// Page DNS CHECK
$(document).ready( function()  {
    // var show_res_div = $('.show_res')
    var dns_result_div = $('.dns_result')

    $("#btn" ).click( function(event)  {
        event.preventDefault()
        var responce = $('.responce')
        var input_text = $('.domain_name_input').val()
        var record_type  = $('#record_type').val()
        responce.remove()
        dns_result_div.append(loader_template)
        var batton = $('.btn_check_dns').attr('disabled','disabled')
        // console.log(batton)
        $.ajax({
            url: '/hello/',
            type: 'get', // This is the default though, you don't actually need to always mention it
            data:{
                input_text: input_text,
                record_type: record_type
            },
            success: function(response) {
                // console.log( Object.values(response.response))
                var loader = $('.loader')
                var responce_from_googledns_div_template = '<div class="responce" style="width:720px; margin-left:15px; padding:5px;">' + 
                '<h3>Google DNS:</h3>'+
                '<div class="response_from_googledns row row-cols-1 row-cols-md-2">'+
                    //response_from_googledns
                 '</div>'+
                '</div>'
                loader.remove()
                dns_result_div.append(responce_from_googledns_div_template)
                batton.removeAttr('disabled')
                var response_from_googledns_div = $('.response_from_googledns')
                if(record_type === 'AAAA' || record_type === 'CNAME'){
                        for (let i = 0; i < (response.response).length; i++){
                            var elem = 
                            '<div class="card responce" style="width:300px;">' +
                            '<div class="card-body">' +
                            '<p> Domain: ' + input_text + '</p>' + 
                            '<p> Response: '+ response.response[i] +'</p>' +
                            '<button class="btn btn_ip_check btn-primary" style="margin-right:15px;" id="btn_ip_check-'+i+'"  value="'+ response.response[i] +'">Check IP</button>'+
                            '<button class="btn btn_check-host btn-primary" style="margin-right:15px; id="btn_check-host-'+i+'"  value="'+ response.response[i] +'">Check-host</button>'+
                            // '<button class="btn btn_whois btn-primary" value="'+ input_text +'">Whois</button>'+//
                            '</div>'+
                            '</div>' 
                            response_from_googledns_div.append(elem);
                    }
                } else if(response.response){
                    
                        for (let i = 0; i < Object.keys(response.response.Answer).length; i++){ 
                            var elem = '<div class="card responce" style="width:300px;">' +
                            '<div class="card-body">' + 
                            '<p> Domain: ' + response.response.Question[0].name + '</p>' + 
                            
                            '<p> Type: ' + $('#record_type').val() + '</p>'+
                    
                            '<p> Response: ' +
                            response.response.Answer[i].data +
                            '</p>' +
                            '<button class="btn btn_ip_check btn-primary" style="margin-right:15px;" id="btn_ip_check-'+i+'"  value="'+ response.response.Answer[i].data +'">Check IP</button>'+
                            
                            '<button class="btn btn_check-host btn-primary" style="margin-right:15px; id="btn_check-host-'+i+'"  value="'+ response.response.Answer[i].name +'">Check-host</button>'+
                            // '<button class="btn btn_whois btn-primary" value="'+ response.response.Answer[i].name +'">Whois</button>'+
                            '</div>'+
                            '</div>' 
                            response_from_googledns_div.append(elem);                                                 
                        }     
                };
                if (response.response_from_timeweb_dns){
                    // console.log('response_from_timeweb_dns.response_from_timeweb_dns:', response.response_from_timeweb_dns)
                    // div для отображения ответа от DNS timeweb
                    
                    dns_result_div.append(
                        '<div class="responce" style="width:720px; margin-left:15px; padding:5px;">'+
                        '<h3> Timeweb DNS: </h3>' +
                            '<div class="response_from_timeweb row row-cols-1 row-cols-md-2">'+
                                //response_from_timeweb_dns
                            '</div>'+
                        '</div>')
                        var response_from_timeweb_div = $('.response_from_timeweb')
                    for (var i = 0; i < (response.response_from_timeweb_dns).length; i++){      
                        response_from_timeweb_div.append(
                                '<div class="card responce" style="width:300px;">' +
                                '<div class="card-body">' + 
                                
                                '<p> Domain: ' + input_text + '</p>' + 
                                
                                '<p> Type: ' + $('#record_type').val() + '</p>'+
                        
                                '<p> Response: ' +
                                    response.response_from_timeweb_dns[i] +
                                '</p>' +
                                '<button class="btn btn_ip_check btn-primary" style="margin-right:15px;" id="btn_ip_check-'+i+'"  value="'+ response.response_from_timeweb_dns[i] +'">Check IP</button>'+
                                
                                '<button class="btn btn_check-host btn-primary" style="margin-right:15px; id="btn_check-host-'+i+'"  value="'+ response.response_from_timeweb_dns[i] +'">Check-host</button>'+
                                // '<button class="btn btn_whois btn-primary" value="'+ input_text +'">Whois</button>'+
                                '</div>'+
                                '</div>' 
                            
                            ); 
                    }
                }
                $('.show_result').removeAttr('style')
                     
            },
            failure: function(response) { 
                alert('Got an error dude');
            }    
        
    }); 
});
    

// Событие после перерисовки странице DNS CHECK
$(".dns_result").bind("DOMSubtreeModified", function(){  
var loader_template = '<div class="loader"></div>'
//Кнопка check ip на DNS check 
$(".btn_ip_check" ).on( 'click', function(evt) {
    
    evt.stopImmediatePropagation();
    var resp_from_ip_check = $('.resp_from_ip_check');
    evt.preventDefault();
    var show_map_div = $('.show_map_div')
    ip_for_check = $(evt.target).val();
    // console.log('btn_ip_check', ip_for_check, evt.target);
    find_responce_from_ip_checker = $('.responce_from_ip_checker')
    if(find_responce_from_ip_checker){
        find_responce_from_ip_checker.remove()
    }
    var loader_template = '<div class="loader"></div>'
    resp_from_ip_check.append(loader_template)
    $.ajax({
        url: '/ip_check/',
        type: 'get', // This is the default though, you don't actually need to always mention it
        data:{
            ip_for_check: ip_for_check
        },
        success: function(response) {
            // console.log(response.resp_from_ip_check)
            var loader = $('.loader')
            loader.remove()
            if(response.resp_from_ip_check){
                resp_from_ip_check.append('<h3 class="responce_from_ip_checker">IP check</h3>')
                // resp_from_ip_check.append('<div class="responce_from_ip_checker map" id="map" style="width:300px; height:300px"></div>')
                var pass_ = {'location':'location','region_code':'region_code', 'continent_code':'continent_code', 'latitude':'latitude', 'longitude':'longitude'}
                // console.log(pass_)
                for (let i = 0; i < Object.keys(response.resp_from_ip_check).length; i++){
                    if( Object.keys(response.resp_from_ip_check)[i] in pass_){
                        continue;
                    }else{
                        resp_from_ip_check.append('<p class="responce_from_ip_checker">' + 
                                      (Object.keys(response.resp_from_ip_check)[i]).toUpperCase() + ': ' + Object.values(response.resp_from_ip_check)[i] + '</p>'
                                    );
                    }            
                } ;
            show_map_div.append('<div class="responce_from_ip_checker map" id="map" style="width:280px; height:280px;"></div>')
            var map;
            DG.then(function () {
                    map = DG.map('map', {
                        center: [response.resp_from_ip_check.latitude, response.resp_from_ip_check.longitude],
                        zoom: 8
                    });
                DG.marker([response.resp_from_ip_check.latitude, response.resp_from_ip_check.longitude]).addTo(map);
                });
            };      
        },
        failure: function(response) { 
            alert('Got an error dude');
        }
    })
});

//Кнопка Check host в на странице DNS CHECK
$(".btn_check-host" ).on( 'click', function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    // console.log('btn_check-host')
    // var resp_from_ip_check = $('.resp_from_ip_check')
    var checkhost = $('.checkhost')
    var request_data = $('.btn_check-host').val()
    // console.log(request_data)
    var find_responce_from_check_host = $('.responce_from_check-host')
    
    if(find_responce_from_check_host){
        find_responce_from_check_host.remove()
    }
    checkhost.append(loader_template)
    $.ajax({
        url: '/check_host/',
        type: 'get', // This is the default though, you don't actually need to always mention it
        data:{
            request_data: request_data
        },
        success: function(response) {
            console.log(response.resp_from_checkhost)
            var loader = $('.loader')
            loader.remove()
            if(response.resp_from_checkhost){
                checkhost.append('<h3 class="responce_from_check-host">Check-host</h3>')
                checkhost.append('<h4 class="responce_from_check-host">Host: '+ request_data +'</h4>')
                for (let i = 0; i < Object.keys(response.resp_from_checkhost.nodes).length; i++){ 
                    checkhost.append(   '<li class="list-group-item responce_from_check-host">' +
                                            '<pre>' + 
                                            Object.keys(response.resp_from_checkhost.nodes)[i] +
                                            ' : ' + 
                                            '</pre>' +
                                            '<pre>' + 
                                            Object.values(response.resp_from_checkhost.nodes)[i] +
                                            '</pre>' + 
                                        '</li>' )
                                    // console.log(response.response)     
                };
                // console.log(response.resp_from_ip_check)     
            };   
                
        },
        failure: function(response) { 
            alert('Got an error dude');
        }
    })
});


$(".btn_whois").on('click', function(evt){
    evt.preventDefault();
    evt.stopImmediatePropagation();
    
    // console.log('whois button on dns check page', $(this).val())
})


});

//Кнопка whois 

});

// page 2 ip check
$('.btn_ip_check_page').click(function(evt){
    ip_check(evt)
})

var ip_check = function (evt){
    evt.stopImmediatePropagation();
    evt.preventDefault();
    $('.btn_ip_check_page').attr('disabled','disabled')
    ip_for_check = $('.ip_adress_for_check').val();
    console.log('btn_ip_check', ip_for_check, evt.target);
    find_responce_from_ip_checker = $('.responce_from_ip_checker_page_2')
    if(find_responce_from_ip_checker){
        find_responce_from_ip_checker.remove()
    }
    $('.show_result_ip_check').append(loader_template)
    var pass_ = {'location':'location','region_code':'region_code', 'continent_code':'continent_code', 'latitude':'latitude', 'longitude':'longitude'}
    $.ajax({
        url: '/ip_check/',
        type: 'get', // This is the default though, you don't actually need to always mention it
        data:{
            ip_for_check: ip_for_check
        },
        success: function(response) {
            // console.log(response.response_from_whois_vu)
            $('.loader').remove()

            // Обработка ответа для resp_from_ip_check
            if(response.resp_from_ip_check){
                $('.show_result_ip_check').append(
                    '<div class="card responce_from_ip_checker_page_2">'+
                        '<div class="card-body responce_from_ip_checker_page_2 body_responce_from_ip_checker_page_2">' +
                            '<h4 class="responce_from_ip_checker_page_2 card-title"><a href="https://ipstack.com" target="blank"> Response from ipstack: </a> </h4>' +
                            
                        '</div>'+
                        '<div class="card-body show_map_div2">'+
                        '</div>'+
                    '</div>')
                // console.log(pass_)
                for (let i = 0; i < Object.keys(response.resp_from_ip_check).length; i++){
                    if( Object.keys(response.resp_from_ip_check)[i] in pass_){
                        continue;
                    }else{
                        $('.body_responce_from_ip_checker_page_2').append(
                            '<pre class="responce_from_ip_checker_page_2">' + 
                                '<strong>' + Object.keys(response.resp_from_ip_check)[i] + '</strong>' + 
                                    ': ' + 
                                    Object.values(response.resp_from_ip_check)[i] + 
                            '</pre>');
                    }            
                } ;
            $('.show_map_div2').append('<div class="responce_from_ip_checker_page_2 map" id="map" style="width:280px; height:280px;"></div>')
            var map;
            DG.then(function () {
                    map = DG.map('map', {
                        center: [response.resp_from_ip_check.latitude, response.resp_from_ip_check.longitude],
                        zoom: 8
                    });
                DG.marker([response.resp_from_ip_check.latitude, response.resp_from_ip_check.longitude]).addTo(map);
                });
            };
            // Ответ от whois.vu
            $('.show_result_ip_check').append(
                '<div class="card responce_from_ip_checker_page_2">'+
                    '<div class="card-body responce_from_ip_checker_page_2">' +
                    '<h4 class="responce_from_whois card-title">' +
                        '<a href="http://whois.vu" target="blank">Whois vu response:</a>' +
                    '</h4>' +
                    '<pre>'+
                            response.response_from_whois_vu +
                    '</pre>'+
                '</div>'+
                '</div>'
            )

            $('.btn_ip_check_page').removeAttr('disabled')      
        },
        failure: function(response) { 
            $('.btn_ip_check_page').removeAttr('disabled')
            alert('Got an error dude');
        }
    })
    };


//Захват нажатия на кнопку на странице 3
$('.btn_whois_page').click(function(evt){
        whois(evt)
})
    
var whois = function(evt){
    evt.stopImmediatePropagation();
    evt.preventDefault();
    var disabled_button = $(".btn_whois_page")
    disabled_button.attr('disabled','disabled')
    var domain_to_whois = $('.domain_whois').val()
    var show_result_whois = $('.show_result_whois')
    // resp_whois
    // var resp_whois = $('.resp_whois')
    var resp_from_whois = $('.responce_from_whois')
    // console.log(domain_to_whois)
    if(resp_from_whois){
        resp_from_whois.remove()
    }
    show_result_whois.append('<div class="loader"></div>')
    $.ajax({
        url: '/whois/',
        type: 'get', // This is the default though, you don't actually need to always mention it
        data:{
            domain_to_whois: domain_to_whois
        },
        success: function(response) {
            var loader = $('.loader')
            loader.remove()
            disabled_button.removeAttr('disabled')
            // console.log(response.resp_from_whois)
            
            if(response.resp_from_whois){
                show_result_whois.append(
                    '<div class="card responce_from_whois">'+
                    '<div class="card-body responce_from_whois">'+
                        '<h4 class="responce_from_whois card-title">Console whois response: </h4>' +
                            '<div class="resp_whois responce_from_whois">'+   
                            // Ответ от whois из консоли
                            '</div>'+
                        '</div>'+   
                    '</div>')
                var resp_whois = $('.resp_whois')     
                for (let i = 0; i < Object.keys(response.resp_from_whois).length; i++){ 
                    if(Object.keys(response.resp_from_whois)[i] === 'name_servers'){
                        resp_whois.append('<pre class="responce_from_whois" style="color:red;">' + 
                                            '<strong>' + Object.keys(response.resp_from_whois)[i] + '</strong>' +
                                            ': ' + 
                                            Object.values(response.resp_from_whois)[i] + '</pre>');
                    }else{
                        resp_whois.append('<pre class="responce_from_whois">' + 
                                    '<strong>' +
                                    Object.keys(response.resp_from_whois)[i] + 
                                    '</strong>' +
                                    ': ' +     
                                    Object.values(response.resp_from_whois)[i] + '</pre>');
                    }          
                } ;
                
                // resp_whois.append('<p class="responce_from_whois">' + response.resp_from_whois[0] + '</p>')
            }
            // console.log(response.whois_vu_response)
            // for(var i = 0; i < Object.keys(response.whois_vu_response).length; i++){
                
                show_result_whois.append(
                    '<div class="whois_vu_response responce_from_whois card">' + 
                    '<div class="whois_vu_response responce_from_whois card-body">' + 
                    '<h4 class="responce_from_whois card-title">' +
                    '<a href="http://whois.vu">Whois vu response:</a>' +
                    '</h4>' +
                        '<pre class="responce_from_whois">'+    
                            response.whois_vu_response + 
                        '</pre>' +
                        '</div>' +
                    '</div>'            
                    )
            // }
        },
        failure: function(response) { 
            alert('Got an error dude');
        }
    })
}