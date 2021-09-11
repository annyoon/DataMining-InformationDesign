### 데이터 불러오기 ###
student <- read.csv("student.csv")

### 데이터 전처리 ###
student <- student[,-c(31, 32)] # 상관성이 너무 큰 변수 제거
student <- student[,-c(1)] # 의미 없는 변수(학교) 제거

### 범주형 변수 변환 ###
install.packages("dummies")
library(dummies)
student <- dummy.data.frame(student, names = c("school", "sex", "address", "famsize", "Pstatus",
                                               "Mjob", "Fjob", "reason", "guardian", "schoolsup",
                                               "famsup", "paid", "activities", "nursery", "higher",
                                               "internet", "romantic"))
student <- student[,-c(2, 5, 7, 9, 32, 34, 36, 38, 40, 42, 44, 46)] # 더미 변수로 인해 중복되는 컬럼 제거

### 데이터 스케일링 ###
student <- transform(student, failures = scale(student$failures),
                     absences = scale(student$absences)) # 표준화

### 다중선형회귀 모형 구축 ###
multi_model <- lm(G3 ~., data = student)
summary(multi_model)

### 모델 성능 평가 ###
d <- deviance(multi_model) # 잔차제곱합
mse <- d / 610 # MSE
mse

install.packages("forecast")
library(forecast)
accuracy(multi_model) # ME, RMSE, MAE, MPE, MAPE, MASE

### 변수 선택법 적용 ###
model_fwd <- step(lm(G3 ~ 1, student, family = binomial()), 
                  direction = "forward", trace = 0, scope = formula(multi_model))
summary(model_fwd) # forward selection

model_bwd <- step(lm(G3 ~ ., student, family = binomial()), 
                  direction = "backward", trace = 0,
                  scope = list(lower = G3 ~ 1, upper = formula(multi_model)))
summary(model_bwd) # backward selection

model_step <- step(lm(G3 ~ ., student, family = binomial()),
                   direction = "both", trace = 0,
                   scope = list(lower = G3 ~ 1, upper = formula(multi_model)))
summary(model_step) # stepwise selection


