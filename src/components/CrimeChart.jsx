import React, { memo, useEffect, useState } from 'react'
import { Line, Pie } from 'react-chartjs-2'
import { chartDataUrl, getChartData } from '../shared/utils'
export default memo(function CrimeChart() {
  const [crimeData, setCrimeData] = useState({
    labels: [],
    data: []
  })
  const [chartData, setChartData] = useState({})
  //function to get crime data
  const fetchCrimeData = async () => {
    const response = await fetch(chartDataUrl)
    const responseData = await response.json()
    crimeData["labels"] = responseData.map((data) => data["Year"]).reverse()
    crimeData["data"] = responseData.map(
      (data) => data[["Motive Confirmed"]]
    ).reverse();
    const crimeChartData = getChartData(crimeData)
    setChartData(crimeChartData)
    setCrimeData(crimeData)
  }

  useEffect(() => {
    fetchCrimeData()
  }, [])
  return (
    <div>
      <Line
        data={chartData}
        options={{
          title: {
            display: true,
            text: "Crime against Journalists",
            fontSize: 25,
          },
          legend: {
            display: true,
            position: "right",
          },
          responsive: true,
          layout: {
            padding: {
              top: 5,
              left: 15,
              right: 15,
              bottom: 15,
            },
          },
        }}
      />
    </div>
  );
})
