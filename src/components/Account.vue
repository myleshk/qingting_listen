<template>
    <div class="account">
        <div v-if="user" class="alert alert-success" role="alert">
            Logged in as {{user.username}}
        </div>
        <div v-else-if="$parent.callbackCode" class="alert alert-secondary" role="alert">
            Loading user info...
        </div>
        <div v-else class="text-right">
            <button @click="beginLogin"
                    class="btn btn-primary">Login
            </button>
        </div>
    </div>
</template>

<script>
    import {serverBus} from '../main';

    export default {
        name: 'Account',
        props: [],
        data: function () {
            return {
                sourceUrl: null,
                loginUrl: 'https://sss.qingting.fm/account/wechat-passport.html?redirect_uri='
                    + window.location.origin + window.location.pathname,
                user: null
            }
        },
        computed: {
            userInquiryURL: function () {
                if (this.$parent.userId)
                    return 'https://u2.qingting.fm/u2/api/v4/user/' + this.$parent.userId
            }
        },
        methods: {
            beginLogin: function () {
                window.location = this.loginUrl;
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
            }
        },
        created() {
            const account = this;
            serverBus.$on('userChange', function () {
                account.updateUserInfo()
            });
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
