<template>

    <div>
        <div class="header"><Header /></div>
        <div class="content" v-if="matches">
            <div class="max-w-90 d-flex justify-content-center" v-if="user">
                <b-col sm="auto" md="6" lg="4" class="rounded-lg shadow bg-light">
                    <div class="matches d-flex flex-column my-3">
                        <div class="match d-flex flex-row my-1 align-items-center" @click="chat(match.username)" v-for="match in matches" :key="match.index">

                            <div class="w-25">
                              <img class="avatar shadow" style="height: 72px; width: 72px; object-fit: cover" v-if="match.image64" :src="'data:image/' + match.image_type + ';base64, ' + match.image64" :alt="match.fname">
                              <b-avatar v-else class="rounded-pill shadow" size="64px"></b-avatar>
                            </div>

                            <div class="p-3 w-50 text-left">
                              <strong>{{match.fname}}</strong> {{ match.lname }}
                            </div>

                            <div v-if="match.online" class="p-3 text-right text-success">online</div>
                            <div v-else class="p-3 text-center text-danger">offline <br><span class="small">last seen:<br><span class="small">{{ match.date_lastseen }}</span></span></div>
                        </div>
                    </div>
                </b-col>
            </div>
        </div>
        <div class="footer"><NavBar/></div>
    </div>

</template>

<script>

import {actions, socket, state} from "@/store"

import NavBar from '@/components/NavBar.vue'
import Header from '@/components/HeaderNav.vue'

export default {
    components: { NavBar, Header },
    data: function () {
        return {
            online: state.online_users,
            user: state.user,
            matches: null
        }
    },
    mounted: async function () {
        this.matches = await actions.getUserMatches()
        this.checkOnline()
    },
    computed: {
        onlineUsers: function () {
            return state.online_users
        }
    },
    watch: {
        onlineUsers: function (newVal, oldVal) {
            this.checkOnline()
        }
    },
    created: function () {
        socket.call.fetchOnlineUsers()
    },
    methods: {
        chat: function (username) {
            this.$router.push(`/chat/${username}`)
        },
        checkOnline: function (username) {
            if (!this.onlineUsers)
                return
            this.onlineUsers.forEach(u => {
                if (this.matches)
                    this.matches.forEach(m => m.online = m.id === u.id)
            })
        }
    }
}
</script>

<style>
    .avatar {
        width: 50px;
        height: auto;
        border-radius: 50%;
    }

    .match {
        cursor: pointer;
    }
</style>