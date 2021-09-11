
### 성능 평가 함수 정의 ###
perf_eval <- function(cm){
  TPR = Recall = cm[2,2] / sum(cm[2,]) # true positive rate
  Precision = cm[2,2] / sum(cm[,2]) # precision
  TNR = cm[1,1] / sum(cm[1,]) # true negative rate
  ACC = sum(diag(cm)) / sum(cm) # accuracy
  BCR = sqrt(TPR * TNR) # balance corrected accuracy (geometric mean)
  F1 = 2 * Recall * Precision / (Recall + Precision) # f1 measure
  
  re <- data.frame(TPR = TPR,
                   Precision = Precision,
                   TNR = TNR,
                   ACC = ACC,
                   BCR = BCR,
                   F1 = F1)
  return(re)
}

### 데이터 불러오기 ###
bank <- read.csv("bank.csv")

### 데이터 전처리 ###
bank <- bank[,-c(11)] # 상관성이 너무 큰 변수 제거
bank$pdays <- replace(bank$pdays, bank$pdays == 999, 50) # 결측치 처리

### 범주형 변수 변환 ###
install.packages("dummies")
library(dummies)
bank <- dummy.data.frame(bank, names = c("job", "marital", "education", "default", "housing",
                                         "loan", "Fjob", "contact", "month", "day_of_week",
                                         "poutcome", "y"))
bank <- bank[,-c(26, 29, 32, 63)]

### 데이터 스케일링 ###
bank <- transform(bank, emp.var.rate = scale(bank$emp.var.rate),
                  cons.price.idx = scale(bank$cons.price.idx),
                  cons.conf.idx = scale(bank$cons.conf.idx),
                  euribor3m = scale(bank$euribor3m),
                  nr.employed = scale(bank$nr.employed)) # 표준화

normalize <- function(n){
  return((n - min(n)) / (max(n) - min(n))) # 정규화
}
bank <- transform(bank, campaign = normalize(bank$campaign),
                  previous = normalize(bank$previous))

### training 데이터와 test 데이터 나누기 ###
set.seed(2020)
test_id <- sample(1:nrow(bank), round(nrow(bank) * 0.7))
bank_train <- bank[test_id, ]
bank_test <- bank[-test_id, ]

### 로지스틱회귀 모형 구축 ###
logistic_model <- glm(yyes ~ ., bank_train, family = binomial())
summary(logistic_model)

### 예측 수행 ###
pred_prob <- predict(logistic_model, bank_test, type = "response")
pred_class <- rep(0, nrow(bank_test))
pred_class[pred_prob > 0.5] <- 1
cm <- table(pred = pred_class, actual = bank_test$yyes)
perf_eval(cm)

### 모델 성능 평가 ###
d <- deviance(logistic_model) # 잔차제곱합
mse <- d / 28780 # MSE
mse

install.packages("forecast")
library(forecast)
accuracy(logistic_model) # ME, RMSE, MAE, MPE, MAPE, MASE

### 변수 선택법 적용 ###
model_fwd <- step(lm(yyes ~ 1, bank, family = binomial()), 
                  direction = "forward", trace = 0, scope = formula(logistic_model))
summary(model_fwd) # forward selection

model_bwd <- step(lm(yyes ~ ., bank_train, family = binomial()), 
                  direction = "backward", trace = 0,
                  scope = list(lower = yyes ~ 1, upper = formula(logistic_model)))
pred_prob <- predict(model_bwd, bank_test, type="response")
pred_class <- rep(0, nrow(bank_test))
pred_class[pred_prob > 0.5] <- 1
cm <- table(pred=pred_class, actual=bank_test$yyes)
perf_eval(cm) # backward selection

model_step <- step(lm(yyes ~ ., bank_train, family = binomial()),
                   direction = "both", trace = 0,
                   scope = list(lower = yyes ~ 1, upper = formula(logistic_model)))
pred_prob <- predict(model_step, bank_test, type="response")
pred_class <- rep(0, nrow(bank_test))
pred_class[pred_prob > 0.5] <- 1
cm <- table(pred=pred_class, actual=bank_test$yyes)
perf_eval(cm) # stepwise selection
