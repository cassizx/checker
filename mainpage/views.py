from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from time import sleep
import requests
import json
import whois
import subprocess
import whois
import pydig


# Create your views here.

def index(request):
 
    return render(request, 'index.html')

def request_to_googledns(request_data):
    URL = "https://dns.google/resolve?"
    params = {
       "name": request_data['name_'],
       "type" : request_data['type_']
    }
    # if params['type'] == 'AAAA':
    #     r = pydig.query(str(params['name']), str(params['type']))
    #     ans = str(r)
    # else:
    r = requests.get(URL, params=params)
    ans = r.json()
    #print(f"RESPONCE FROM GOOGLE DNS:\n{json.dumps(ans)}\n")
    #a = r.json()
    # print(ans)
    return ans


def request_to_checkhost(request):
    if request.is_ajax():
        try:
            request_data = request.GET['request_data']
            CHECKTYPE = "http"
            params1 = {
                "host" : request_data,
                "max_nodes": 5
            }
            url = f"https://check-host.net/check-{CHECKTYPE}?"
            r = requests.get(url, params=params1, headers={ "Accept":"application/json"} )
            resp_from_checkhost = r.json()
            print(resp_from_checkhost)
            return JsonResponse({'resp_from_checkhost': resp_from_checkhost }, status = 200)  
        except Exception as err:
                html = f"Error {err}."
                print(html)
                return JsonResponse({'response':html, }, status = 200)     
    else:
        html = "Error."
        return JsonResponse({'response':html, }, status = 500) 

def ip_check(request):
    # ip_list = ''
    # for i in ip:
    #     print(i)
    #     ip_list += i+', '
    #print(str(ip_list))

    API_KEY = "cc1cd7b24fad9f20fd8404e709d07ec1"  #api.ipstack.com
    if request.is_ajax():
        try:
            ip = str(request.GET['ip_for_check'])
            url = f"http://api.ipstack.com/{ip}?access_key={API_KEY}&language=ru&output=json"
            r = requests.get(url)
            resp_from_ip_check = r.json()
            response_from_whois_vu = whois_vu(ip)
            return JsonResponse({'resp_from_ip_check': resp_from_ip_check, 'response_from_whois_vu': response_from_whois_vu}, status = 200)
        except Exception as err:
            html = f"Error {err}."
            print(html)
            return JsonResponse({'response':html, }, status = 200)   
    else:
        html = "Error."
        return JsonResponse({'response':html, }, status = 500)  


def whois_vu(domain_or_ip):
    url= "http://api.whois.vu/"
    # params_whois = {
    #     'q': domain_or_ip
    #     }
    try:
        whois_vu_req = requests.get(url, params={'q': domain_or_ip})
        whois_vu_response = whois_vu_req.json()['whois']
        
    except Exception as err:
        return err
    else:
        return whois_vu_response
    

def whois_def(request):
    #w = whois.whois('timeweb.com')
    if request.is_ajax():
        try:
            domain = request.GET['domain_to_whois']
            resp_from_whois = whois.whois(domain)
            print(resp_from_whois)
            # url= "http://api.whois.vu/"
            # params_whois = {'q': domain}
            # whois_req = requests.get(url, params=params_whois)
            whois_vu_response = whois_vu(domain)
            print(whois_vu_response)
            return JsonResponse({'resp_from_whois': resp_from_whois, 'whois_vu_response': whois_vu_response}, status = 200) 
        except Exception as err:
            html = f"Error {err}."
            print(html)
            return JsonResponse({'response':html, }, status = 200)   
    else:
        html = "Error."
        return JsonResponse({'response':html, }, status = 500) 


def hello(request):  
    if request.is_ajax():
        try:
            domain = request.GET['input_text']
            record_type = request.GET['record_type']

            # print(domain, record_type)
            if record_type == 'AAAA' or record_type == 'PTR':
                resp_from_googledns = pydig.query(str(domain), str(record_type))
                # print(resp_from_googledns, 'if work')
            else:
                
                resp_from_googledns = request_to_googledns(request_data = {
                            "name_": domain,
                            "type_": record_type
                        })     
            #sleep(0.1)
            resolver = pydig.Resolver(
                executable='/usr/bin/dig',
                nameservers=[
                    '92.53.116.26' #ns timeweb
            ])
            response_from_timeweb_dns = pydig.query(str(domain), str(record_type))
            return JsonResponse({'response': resp_from_googledns, 'response_from_timeweb_dns':response_from_timeweb_dns}, status = 200) 
        except Exception as err:
            html = f"Error {err}."
            print(html)
            return JsonResponse({'response':html, }, status = 200)   
    else:
        html = "Error."
        return JsonResponse({'response':html, }, status = 500) 