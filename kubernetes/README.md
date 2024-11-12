# DB Kubernetes Deployment

이 프로젝트는 MySQL 데이터베이스를 쿠버네티스에 배포하기 위한 매니페스트 파일들을 포함하고 있습니다.

## 사전 준비사항

1. 쿠버네티스 클러스터 접근 권한
2. kubectl 설치
3. 데이터베이스 시크릿

## 환경 변수 설정

`common/base/secret.yaml` 파일을 작성해주세요.

## 배포 방법

### 0. common 배포 (configmap, secret)

```bash
# 프로젝트 디렉토리로 이동
cd common

# 모든 리소스 한번에 배포
kubectl apply -k base/
```

### 1. balance-db 배포

```bash
# 프로젝트 디렉토리로 이동
cd balance-db

# 모든 리소스 한번에 배포
kubectl apply -k base/
```

### 2. 배포 확인

```bash
# Pod 상태 확인
kubectl get pods -l app=balance-db

# Secret 확인
kubectl get secrets -l app=balance-db

# ConfigMap 확인
kubectl get configmaps -l app=balance-db

# PVC 상태 확인
kubectl get pvc -l app=balance-db

# Service 확인
kubectl get svc -l app=balance-db
```

### 3. 배포 삭제

```bash
# 모든 리소스 삭제
kubectl delete -k base/
```

## 주의사항

1. PersistentVolume은 클러스터에 맞게 설정되어야 합니다.
2. MySQL 초기화 스크립트는 ConfigMap의 init.sql에 추가해야 합니다.

## 문제 해결

데이터베이스 Pod의 로그 확인:

```bash
kubectl logs -l app=balance-db
```

데이터베이스 Pod의 이벤트 확인:

```bash
kubectl describe pod -l app=balance-db
```
