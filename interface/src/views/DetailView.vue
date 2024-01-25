<script setup>
import Emulator from '../components/Emulator.vue';
</script>

<template>
    <v-container>
        <router-link to="/">
            <v-btn>back</v-btn>
        </router-link>
        <v-divider style="margin: 10px;"></v-divider>
        <h2>Voltages</h2>
        <Line :data="data" :options="options" :key="componentKey" />
        <v-divider style="margin: 10px;"></v-divider>
        <h2>Emulator</h2>
        <emulator url="http://localhost:3000/generate?key=Your-Device-Key&emulator=true" />
    </v-container>
</template>

<script>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export default {
    name: 'App',
    components: {
        Line
    },
    data() {
        return {
            componentKey: 0,
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
        this.getData()
    },
    methods: {
        async getData() {
            const response = await fetch("http://localhost:3000/api/voltages/"+this.$route.params.id);
            const res = await response.json();
            const labels = res.map((item) => (new Date(item.created_at)).toLocaleDateString("de-DE") + " " + (new Date(item.created_at)).toLocaleTimeString("de-DE") + "("+item.wakeups+")");
            const data = res.map((item) => (item.voltage));
            
            this.data.labels = labels;
            this.data.datasets[0].data = data;
            this.reloadLine();

            console.log(res[0].created_at)
        },
        reloadLine() {
            this.componentKey += 1;
        }
    }
}
</script>