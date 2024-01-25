<script setup>
import Emulator from '../components/Emulator.vue';
</script>

<template>
    <v-container>
        <router-link to="/">
            <v-btn>back</v-btn>
        </router-link>
        <v-btn style="margin-left: 10px;" color="red" @click="deleteRoom">delete room</v-btn>

        <v-divider style="margin: 10px;"></v-divider>
        <v-card>
            <v-card-title>
                <h2>Room Information</h2>
            </v-card-title>
            <v-card-text>
                <v-table>
                    <tbody>
                    <tr>
                        <td>update URL</td>
                        <td>{{ windowLocation + "/generate" }}</td>
                    </tr>
                    <tr>
                        <td>device key / secret</td>
                        <td>{{ deviceInformation.secret }}</td>
                    </tr>
                    <tr>
                        <td>room type</td>
                        <td>{{ deviceInformation.type }}</td>
                    </tr>
                    <tr>
                        <td>QRCODE URL</td>
                        <td>{{ deviceInformation.url }}</td>
                    </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
        <v-divider style="margin: 10px;"></v-divider>
        <v-card>
            <v-card-text>
                <h2>Voltages</h2>
            </v-card-text>
            <v-card-text>
                <Line :data="data" :options="options" :key="componentKey" />
            </v-card-text>
        </v-card>
        <v-divider style="margin: 10px;"></v-divider>
        <emulator :url="emulatorURL" />
    </v-container>
</template>

<script>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
)

export default {
    name: 'App',
    components: {
        Line
    },
    data() {
        return {
            componentKey: 0,
            deviceInformation: {},
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Voltage',
                        backgroundColor: '#f87979',
                        data: []
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        }
    },
    mounted() {
        this.getVoltages()
        this.getRoomData()
    },
    computed: {
        windowLocation() {
            return window.location.origin;
        },
        emulatorURL() {
            console.log("" + "/generate?key=" + this.deviceInformation.secret + "&emulator=true")
            return "" + "/generate?key=" + this.deviceInformation.secret + "&emulator=true";

            //return this.windowLocation + "/generate?key=" + this.deviceInformation.secret + "&emulator=true";
        }
    },
    methods: {
        async getVoltages() {
            const response = await fetch("/api/voltages/"+this.$route.params.id);
            const res = await response.json();
            const labels = res.map((item) => (new Date(item.created_at)).toLocaleDateString("de-DE") + " " + (new Date(item.created_at)).toLocaleTimeString("de-DE") + "("+item.wakeups+")");
            const data = res.map((item) => (item.voltage));
            
            this.data.labels = labels;
            this.data.datasets[0].data = data;
            this.reloadLine();

            console.log(res[0].created_at)
        },
        async getRoomData() {
            const response = await fetch("/api/rooms/"+this.$route.params.id);
            this.deviceInformation = await response.json();
        },
        reloadLine() {
            this.componentKey += 1;
        },
        deleteRoom() {
            fetch("/api/rooms/"+this.$route.params.id, {
                method: 'DELETE',
            }).then(() => {
                this.$router.push('/')
            })
        }
    }
}
</script>