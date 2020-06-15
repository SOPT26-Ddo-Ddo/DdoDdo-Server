# DdoDdo-Server 
팀원: 김민지, 김보배


## ✔️ BASE URL : 52.78.27.117:3000/

| 기능 | 뷰 | URL | method |
|---|-----------|-------------|---|
| 토큰 부여(해커톤 성 일회용) | 홈 화면 | /token/ | GET | 
| 회원가입 | - | /user/signup | Post|
| 로그인 | - |/user/signin | Post |
| 모든 프로필 조회 | - | /user/profile | GET |
| 특정 프로필 조회 | - | /user/profile/:userId | GET |
| 특정 아이디가 속해 있는 그룹 리스트 | 홈 화면 | /home/ | GET |
| 특정 그룹 정보 조회 | 버디버디 4조 화면 | /group/:groupIdx/ | GET |
| 마니또 알고리즘 수행해서 마니또 정보 넣어주고, 값 가져오기 | 마니또 결과 화면 | /group/:groupIdx/Manito | GET |



***

## API 명세서 링크
https://github.com/SOPT26-Ddo-Ddo/DdoDdo-Server/wiki


***
## server architecture
![서버 아키텍쳐](https://user-images.githubusercontent.com/37949197/84633151-edb87f00-af2a-11ea-91da-38ac21e1f5e4.png)



***

## EC2 서버 구동 결과 화면

* 홈 화면 결과

![홈 화면 ec2](https://user-images.githubusercontent.com/37949197/83956228-98c79980-a896-11ea-8a5b-a604cc849663.png)


* 그룹 조회 화면

![그룹 조회 화면](https://user-images.githubusercontent.com/37949197/83956229-99f8c680-a896-11ea-9608-4691a82f1b4e.png)


* 마니또 매칭 화면

![image](https://user-images.githubusercontent.com/37949197/83956867-42aa2480-a89d-11ea-854e-4f9e1b9183f2.png)



***


## Database ERD

<img width="688" alt="KakaoTalk_20200607_014438116" src="https://user-images.githubusercontent.com/37949197/83949770-8cc0e500-a860-11ea-9776-fe3229eb5a42.png">




