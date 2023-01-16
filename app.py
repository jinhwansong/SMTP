from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

import requests
from bs4 import BeautifulSoup

import certifi
ca = certifi.where()

from pymongo import MongoClient
client = MongoClient('mongodb+srv://rjsgh17:174680rjsgh@Cluster0.jn5ikhy.mongodb.net/Cluster0?retryWrites=true&w=majority', tlsCaFile=ca)
db = client.SMTP_DB

@app.route('/')
def home():
    return render_template('main.html')

@app.route('/record')
def record_page():
    return render_template('record.html')

@app.route("/record", methods=["POST"])
def app_record_post():
    url_receive = request.form['url_give']
    comment_receive = request.form['comment_give']
    category_receive = request.form['category_give']
    try:
        idnum = db.SMTP_DB.find_one(sort=[("num", -1)])["num"] + 1
    except:
        idnum = 1

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    name_receive = soup.select_one('meta[property="og:title"]')['content']
    image_receive = soup.select_one('meta[property="og:image"]')['content']

    doc = {
        'name': name_receive,
        'image': image_receive,
        'comment': comment_receive,
        'num': idnum,
        'category': category_receive,
        'url':url_receive,
        'done' :0
    }
    db.SMTP_DB.insert_one(doc)


    return jsonify({'msg': '등록완료'})

@app.route("/record_data", methods=["GET"])
def web_record_get():
    record_list = list(db.SMTP_DB.find({}, {'_id': False}))
    return jsonify({'records':record_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
