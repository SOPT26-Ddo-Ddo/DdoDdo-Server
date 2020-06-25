# DdoDdo-Server 

팀원: 김민지, 김보배

***
## ✔️ BASE URL : 52.78.27.117:3000/

| 기능 | 뷰 | URL | method |
|---|-----------|-------------|---|
| 토큰 부여(해커톤 성 일회용) | 홈 화면 | /token | GET | 
| 회원가입 | - | /user/signup | Post|
| 로그인 | - |/user/signin | Post |
| 프로필 사진 업데이트 | - |/user/profile | Post |
| 모든 프로필 조회 | - | /user/profile | GET |
| 특정 프로필 조회 | - | /user/profile/:userId | GET |
| 특정 아이디가 속해 있는 그룹 리스트 | 홈 화면 | /home | GET |
| 그룹 만들기 | - | /group | GET |
| 특정 그룹 조회 | 버디버디 4조 화면 | /group/:groupIdx | GET |
| 그룹 들어가기 | - | /group/:groupIdx/in | GET |
| 마니또 알고리즘 수행해서 마니또 정보 넣어주고, 값 가져오기 | 마니또 결과 화면 | /group/:groupIdx/manito | GET |



***

## API 명세서 링크
https://github.com/SOPT26-Ddo-Ddo/DdoDdo-Server/wiki


***
## server architecture
![서버 아키텍쳐](https://user-images.githubusercontent.com/37949197/84633151-edb87f00-af2a-11ea-91da-38ac21e1f5e4.png)

***


## Database ERD

![ERD](https://user-images.githubusercontent.com/37873745/85742299-1536f500-b73e-11ea-8286-858fe3dc8e55.png)


