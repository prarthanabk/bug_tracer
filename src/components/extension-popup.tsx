'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CircleOff, CircleIcon, FileText, Download } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export function ExtensionPopupComponent() {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecordedData, setHasRecordedData] = useState(false)
  const [systemInfo, setSystemInfo] = useState({
    os: "Unknown",
    country: "Unknown",
    time: new Date().toLocaleString(),
  })
  const [recordedData, setRecordedData] = useState({
    console: "",
    network: "",
    performance: "",
    memory: "",
  })
  const [isReportGenerated, setIsReportGenerated] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reportProgress, setReportProgress] = useState(0)

  useEffect(() => {
    // Simulating getting system info
    const getSystemInfo = async () => {
      // In a real extension, you'd use browser APIs to get this information
      setSystemInfo({
        os: "Windows 10",
        country: "United States",
        time: new Date().toLocaleString(),
      })
    }
    getSystemInfo()
  }, [])

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (isRecording) {
      setHasRecordedData(true)
      // Simulating data recording
      setRecordedData({
        console: "Error: Cannot read property 'length' of undefined\nWarning: React does not recognize the `someProps` prop on a DOM element.",
        network: "GET https://api.example.com/data 200 OK\nPOST https://api.example.com/update 403 Forbidden",
        performance: "First Contentful Paint: 1.2s\nLargest Contentful Paint: 2.5s\nCumulative Layout Shift: 0.1",
        memory: "JS Heap Size: 23.8 MB\nUsed JS Heap Size: 21.5 MB\nTotal JS Heap Size: 35.7 MB",
      })
    } else {
      // Here you would start the actual recording process
    }
  }

  const generateReport = async () => {
    setIsGeneratingReport(true)
    setReportProgress(0)

    // Simulating report generation process
    for (let i = 0; i <= 100; i += 10) {
      setReportProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    setIsGeneratingReport(false)
    setIsReportGenerated(true)
  }

  const downloadReport = () => {
    const report = `
DevTools Recording Report
Generated on: ${new Date().toLocaleString()}

System Information:
OS: ${systemInfo.os}
Country: ${systemInfo.country}
Time: ${systemInfo.time}

Console Logs:
${recordedData.console}

Network Activity:
${recordedData.network}

Performance Metrics:
${recordedData.performance}

Memory Usage:
${recordedData.memory}
    `.trim()

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'devtools-report.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">DevTools Recorder</CardTitle>
        <CardDescription>Record console, network, performance, and memory data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "default"}
            className="w-full"
          >
            {isRecording ? (
              <>
                <CircleOff className="mr-2 h-4 w-4" /> Stop Recording
              </>
            ) : (
              <>
                <CircleIcon className="mr-2 h-4 w-4" /> Start Recording
              </>
            )}
          </Button>
        </div>
        
        {hasRecordedData && !isRecording && (
          <Button onClick={generateReport} className="w-full mb-4" disabled={isGeneratingReport}>
            <FileText className="mr-2 h-4 w-4" /> 
            {isGeneratingReport ? 'Generating Report...' : 'Generate Report'}
          </Button>
        )}

        {isGeneratingReport && (
          <Progress value={reportProgress} className="w-full mb-4" />
        )}
        
        <Tabs defaultValue="console" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>
          <TabsContent value="console">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {recordedData.console || "Console logs will appear here..."}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="network">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {recordedData.network || "Network activity will appear here..."}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="performance">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {recordedData.performance || "Performance metrics will appear here..."}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="memory">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {recordedData.memory || "Memory usage will appear here..."}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="w-full text-sm text-muted-foreground">
          <p>OS: {systemInfo.os}</p>
          <p>Country: {systemInfo.country}</p>
          <p>Time: {systemInfo.time}</p>
        </div>
      </CardFooter>

      <Dialog>
        <DialogTrigger asChild>
          <Button className={isReportGenerated ? "w-full" : "hidden"}>
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generated Report</DialogTitle>
            <DialogDescription>
              Here&apos;s the report generated from your recorded data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <h3 className="font-bold">Console Logs:</h3>
              <p className="whitespace-pre-wrap">{recordedData.console}</p>
              <h3 className="font-bold mt-4">Network Activity:</h3>
              <p className="whitespace-pre-wrap">{recordedData.network}</p>
              <h3 className="font-bold mt-4">Performance Metrics:</h3>
              <p className="whitespace-pre-wrap">{recordedData.performance}</p>
              <h3 className="font-bold mt-4">Memory Usage:</h3>
              <p className="whitespace-pre-wrap">{recordedData.memory}</p>
              <h3 className="font-bold mt-4">System Information:</h3>
              <p>OS: {systemInfo.os}</p>
              <p>Country: {systemInfo.country}</p>
              <p>Time: {systemInfo.time}</p>
            </ScrollArea>
          </div>
          <Button onClick={downloadReport} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  )
}