<template>
    <nav class="navbar navbar-expand-lg navbar-light account">
        <a class="navbar-brand" href="https://www.qingting.fm/"><img src="../assets/logo.png"/></a>
        <div class="account-wrapper">
            <template v-if="user">
                <span class="username">
                    您好，{{user.username}}
                </span>
                <button class="logout btn btn-dark btn-sm" @click="logout">登出</button>
            </template>
            <span v-else-if="$parent.callbackCode" class="alert alert-secondary" role="alert">加载中，请稍候</span>
            <b-btn v-else v-b-modal.loginModal>登录</b-btn>


            <!-- Modal Component -->
            <b-modal ref="loginModalRef" hide-footer id="loginModal" title="用户登录">
                <b-form @submit="onSubmit" @input="clearFormError">
                    <b-form-group id="usernameInputGroup"
                                  label="手机号"
                                  label-for="usernameInput">
                        <b-form-input id="usernameInput"
                                      type="tel"
                                      v-model="form.username"
                                      placeholder="请输入手机号"
                                      :class="(form.submitted && !form.username)?'is-invalid':''">
                        </b-form-input>
                        <b-form-invalid-feedback>请输入用户名</b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group id="passwordInputGroup"
                                  label="密码"
                                  label-for="passwordInput">
                        <b-form-input id="passwordInput"
                                      type="password"
                                      v-model="form.password"
                                      placeholder="请输入密码"
                                      :class="(form.submitted && !form.password)?'is-invalid':''">
                        </b-form-input>
                        <b-form-invalid-feedback>请输入密码</b-form-invalid-feedback>
                    </b-form-group>
                    <div v-if="form.submitted && form.errorMessage" class="alert alert-danger" role="alert">
                        {{ form.errorMessage }}
                    </div>
                    <b-button type="submit" class="btn-block" variant="primary">登录</b-button>
                </b-form>
                <div class="external-login">
                    <a :href="wechatLoginUrl">
                        <img src="../assets/wechat.png"/>
                    </a>
                </div>
            </b-modal>
        </div>
    </nav>
</template>

<script>
    import {serverBus} from '../main';

    export default {
        name: 'Account',
        props: [],
        data: function () {
            return {
                sourceUrl: null,
                wechatLoginUrl: 'https://sss.qingting.fm/account/wechat-passport.html?redirect_uri='
                    + window.location.origin + window.location.pathname,
                user: null,
                loginUrl: 'https://u2.qingting.fm/u2/api/v4/user/login',
                form: {
                    username: '',
                    password: '',
                    submitted: false,
                    errorMessage: false
                },
            }
        },
        computed: {
            userInquiryURL: function () {
                if (this.$parent.userId)
                    return 'https://u2.qingting.fm/u2/api/v4/user/' + this.$parent.userId
            }
        },
        methods: {
            onSubmit(event) {
                event.preventDefault();
                this.form.submitted = true;
                if (this.form.username && this.form.password) {
                    this.axios.post(this.loginUrl, {
                        account_type: 5,
                        device_id: 'web',
                        user_id: this.form.username,
                        password: this.form.password
                    }, {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .then(response => {
                            if (response && response.data) {
                                if (response.data.data) {
                                    serverBus.$emit('loginSuccess', response.data.data)
                                } else if (response.data.errormsg) {
                                    this.form.errorMessage = response.data.errormsg
                                }
                            } else {
                                this.form.errorMessage = "发生未知错误，请稍后重试"
                            }
                        })
                        .catch(() => {
                            this.form.errorMessage = "发生未知错误，请稍后重试"
                        });
                }
            },
            clearFormError: function () {
                this.form.errorMessage = false;
                this.form.submitted = false
            },
            updateUserInfo: function () {
                if (this.$parent.userId) {
                    this.axios.get(this.userInquiryURL)
                        .then(response => {
                            if (response && response.data && response.data.data) {
                                this.user = response.data.data;
                            }
                        });
                }
            },
            logout: function () {
                this.user = null;
                serverBus.$emit('logout')
            }
        },
        created() {
            const account = this;
            serverBus.$on('userChange', function () {
                account.$refs.loginModalRef.hide();
                account.updateUserInfo()
            });
        }
    }
</script>

<style scoped>
    div.account-wrapper {
        margin-left: auto;
    }

    .navbar-brand img {
        width: 220px;
    }

    span.username {
        white-space: nowrap;
        position: absolute;
        right: 71px;
        bottom: 20px;
    }

    nav.account {
        text-align: left;
    }

    .external-login {
        margin-top: 15px;
        text-align: center;
    }
</style>