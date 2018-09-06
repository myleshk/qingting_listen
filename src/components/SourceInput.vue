<template>
    <div class="source-input needs-validation">
        <div class="input-group">
            <input class="form-control" :class="(sourceUrl && !UrlIsValid)?'is-invalid':''" type="text"
                   title="Source Page URL"
                   placeholder="Input source page URL here."
                   v-model="sourceUrl" @input="validateUrl">
            <button title="Submit" class="submit btn input-group-prepend btn-primary" :disabled="disableSubmit"
                    @click="urlSubmit">
                Submit
            </button>
            <div class="invalid-feedback">
                Please input a valid URL from QingtingFM page.
            </div>
        </div>

    </div>
</template>

<script>
    import {serverBus} from '../main';

    export default {
        name: 'SourceInput',
        data: function () {
            return {
                sourceUrl: "",
                UrlIsValid: true,
                disableSubmit: true,
                matchGroups: null
            }
        },
        methods: {
            urlSubmit: function () {
                if (this.validateUrl()) {
                    this.disableSubmit = true;
                    this.$parent.channelId = this.matchGroups.channel;
                    this.$parent.page = this.matchGroups.page;
                    this.$cookies.set('channel_id', this.$parent.channelId)
                        .set('page', this.$parent.page)
                        .set('source_url', this.sourceUrl);
                    serverBus.$emit('urlSubmit');
                }
            },
            validateUrl: function () {
                const regex = /[htps]+:\/\/www\.qingting\.fm\/channels\/(?<channel>\d+)(\/(?<page>\d+).*|)/;

                if (this.sourceUrl) {
                    const match = regex.exec(this.sourceUrl);
                    if (match && match.groups && match.groups.channel) {
                        // URL is valid QingtingFM page
                        this.matchGroups = match.groups;
                        this.disableSubmit = false;
                        this.UrlIsValid = true;
                        return true;
                    } else {
                        this.UrlIsValid = false;
                    }

                    return false;
                }
                this.disableSubmit = true;
            },
        },
        mounted() {
            const sourceUrl = this.$cookies.get('source_url');

            if (sourceUrl) {
                this.sourceUrl = sourceUrl;
            }
        }
    }
</script>

<style scoped>
    div.source-input {
        margin-bottom: 15px;
    }

    .source-input input {
        max-width: 500px;
        margin-left: auto;
    }

    button.submit {
        margin-right: auto;
    }
</style>