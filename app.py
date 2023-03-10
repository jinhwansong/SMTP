from flask import Flask, render_template, jsonify, request, session, redirect, url_for
app = Flask(__name__)

import requests
from bs4 import BeautifulSoup

import certifi
ca = certifi.where()

SECRET_KEY = 'SPARTA'

# JWT 패키지를 사용합니다.
import jwt
import datetime
import hashlib

from pymongo import MongoClient
client = MongoClient('mongodb+srv://rjsgh17:174680rjsgh@Cluster0.jn5ikhy.mongodb.net/Cluster0?retryWrites=true&w=majority', tlsCaFile=ca)
db = client.SMTP_DB


# login화면 호출
@app.route('/')
def login():
    return render_template('index.html')
# 토큰 디코드, 디비에서 id값 조회
@app.route('/api/main')
def home1():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.user.find_one({"id": payload['id']})
        return render_template('main.html', nickname=user_info["nick"])
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))

# 회원가입 api
@app.route('/api/register', methods=['POST'])
def api_register():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    nickname_receive = request.form['nickname_give']
# pw_hash 에 받은 비밀번호를 암호화 해서 반환.
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    db.user.insert_one({'id': id_receive, 'pw': pw_hash,'nick': nickname_receive})

    return jsonify({'result': 'success'})


# [로그인 API]
# id, pw를 받아서 맞춰보고, 토큰을 만들어 발급합니다.
@app.route('/api/login', methods=['POST'])
def api_login():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']

    # 회원가입 때와 같은 방법으로 pw를 암호화합니다.
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    # id, 암호화된pw을 가지고 해당 유저를 찾습니다.
    result = db.user.find_one({'id': id_receive, 'pw': pw_hash})

    # 찾으면 JWT 토큰을 만들어 발급합니다.
    if result is not None:
        # JWT 토큰에는, payload와 시크릿키가 필요합니다.
        # 시크릿키가 있어야 토큰을 디코딩(=풀기) 해서 payload 값을 볼 수 있습니다.
        # 아래에선 id와 exp를 담았습니다. 즉, JWT 토큰을 풀면 유저ID 값을 알 수 있습니다.
        # exp에는 만료시간을 넣어줍니다. 만료시간이 지나면, 시크릿키로 토큰을 풀 때 만료되었다고 에러가 납니다.
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=3600)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        # token을 줍니다.
        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

# [유저 정보 확인 API]
# 로그인된 유저만 call 할 수 있는 API입니다.
# 유효한 토큰을 줘야 올바른 결과를 얻어갈 수 있습니다.
# (그렇지 않으면 남의 장바구니라든가, 정보를 누구나 볼 수 있겠죠?)
@app.route('/api/nick', methods=['GET'])
def api_valid():
    token_receive = request.cookies.get('mytoken')

    # try / catch 문?
    # try 아래를 실행했다가, 에러가 있으면 except 구분으로 가란 얘기입니다.

    try:
        # token을 시크릿키로 디코딩합니다.
        # 보실 수 있도록 payload를 print 해두었습니다. 우리가 로그인 시 넣은 그 payload와 같은 것이 나옵니다.
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        print(payload)

        # payload 안에 id가 들어있습니다. 이 id로 유저정보를 찾습니다.
        # 여기에선 그 예로 닉네임을 보내주겠습니다.
        userinfo = db.user.find_one({'id': payload['id']}, {'_id': 0})
        return jsonify({'result': 'success', 'nickname': userinfo['nick']})
    except jwt.ExpiredSignatureError:
        # 위를 실행했는데 만료시간이 지났으면 에러가 납니다.
        return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다.'})
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다.'})


@app.route('/main')
def home():
    return render_template('main.html')

@app.route('/record')
def record_page():
    return render_template('record.html')

@app.route("/record", methods=["POST"])
def app_record_post():
    url_receive = request.form['url_give']
    comment_receive = request.form['comment_give']
    category_receive = int(request.form['category_give'])
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

# 검색기능
@app.route("/record_search", methods=["GET"])
def web_searching():
    search_list = list(db.SMTP_DB.find({}, {'_id': False}))
    return jsonify({'searching':search_list})


# 찜 기능
@app.route("/record_jjim_done", methods=["POST"])
def web_jjim_done():
    num_receive = request.form['num_give']
    db.SMTP_DB.update_one({'num': int(num_receive)}, {'$set': {'done': 1}})
    return jsonify({'msg':'찜 완료~'})

@app.route("/record_jjim_del", methods=["POST"])
def web_jjim_del():
    num_receive = request.form['num_give']
    db.SMTP_DB.update_one({'num': int(num_receive)}, {'$set': {'done': 0}})
    return jsonify({'msg':'찜 취소 완료!'})

@app.route("/jjim", methods=["GET"])
def web_jjim():
    jjim_list = list(db.SMTP_DB.find({}, {'_id': False}))
    return jsonify({'jjim': jjim_list})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
