'use client';

import { useState, useRef } from 'react';
import EInkDisplay, { type EInkDisplayRef } from '@/components/EInkDisplay';
import { plugins, type PluginKey } from '@/plugins';
import { generateEInkHTML, type PluginData } from '@/utils/htmlGenerator';

export default function Home() {
  const [selectedPlugin, setSelectedPlugin] = useState<PluginKey>('calendar');
  const [isLoading, setIsLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_TRMNL_BASE_URL || 'https://trmnl.slj.me/api/display/update');
  const [deviceId, setDeviceId] = useState(process.env.NEXT_PUBLIC_TRMNL_DEFAULT_DEVICE_ID || '1');
  const [bearerToken, setBearerToken] = useState(process.env.NEXT_PUBLIC_TRMNL_BEARER_TOKEN || '');
  const [showHTMLPreview, setShowHTMLPreview] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState('');

  const displayRef = useRef<EInkDisplayRef>(null);
  const SelectedComponent = plugins[selectedPlugin];

  const generatePlainHTML = () => {
    const pluginData: PluginData = {
      title: selectedPlugin,
      data: {},
    };
    const html = generateEInkHTML(selectedPlugin, pluginData);
    setGeneratedHTML(html);
    setShowHTMLPreview(true);
  };

  const copyHTMLToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedHTML);
      alert('HTML copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy HTML:', error);
      alert('Failed to copy HTML to clipboard');
    }
  };

  const downloadHTML = () => {
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPlugin}-eink-display.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePushHTML = async () => {
    if (!baseUrl.trim() || !deviceId.trim()) {
      alert('Please enter base URL and device ID');
      return;
    }

    if (!bearerToken.trim()) {
      alert('Please enter bearer token');
      return;
    }

    if (!generatedHTML) {
      alert('Please generate HTML first');
      return;
    }

    setIsLoading(true);
    try {
      const fullUrl = `${baseUrl}?device_id=${deviceId}`;
      
      const response = await fetch('/api/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: fullUrl,
          token: bearerToken,
          markup: generatedHTML,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      alert('HTML pushed successfully!');
    } catch (error) {
      console.error('Error pushing HTML:', error);
      alert('Failed to push HTML. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">E-Ink Display Generator</h1>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Preview (800x480)</h2>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
              <EInkDisplay ref={displayRef}>
                <SelectedComponent />
              </EInkDisplay>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Plugin Selection</h2>
              <select
                value={selectedPlugin}
                onChange={(e) => setSelectedPlugin(e.target.value as PluginKey)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {Object.keys(plugins).map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">HTML Generation</h2>
              <div className="space-y-3">
                <button
                  onClick={generatePlainHTML}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Generate Plain HTML
                </button>
                
                {generatedHTML && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={copyHTMLToClipboard}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        Copy HTML
                      </button>
                      <button
                        onClick={downloadHTML}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        Download
                      </button>
                    </div>
                    
                    {showHTMLPreview && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Generated HTML Preview:</span>
                          <button
                            onClick={() => setShowHTMLPreview(false)}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Hide
                          </button>
                        </div>
                        <textarea
                          value={generatedHTML}
                          readOnly
                          className="w-full h-32 p-2 border border-gray-300 rounded-md text-xs font-mono bg-gray-50"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">TRMNL Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">Base URL</label>
                  <input
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://trmnl.slj.me/api/display/update"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">Device ID</label>
                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    placeholder="1"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">Bearer Token</label>
                  <input
                    type="password"
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                    placeholder="3|nFufuQ3Wc4IurBnf4DBRlZTOZvus8a3JZhir9Uk2..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  />
                </div>
                <button
                  onClick={handlePushHTML}
                  disabled={isLoading || !generatedHTML}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Pushing to TRMNL...' : 'Push to TRMNL Display'}
                </button>
                {!generatedHTML && (
                  <p className="text-sm text-gray-500 text-center">
                    Generate HTML first before pushing
                  </p>
                )}
                
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md border">
                  <p className="font-medium mb-1 text-gray-600">API Format:</p>
                  <p className="font-mono">POST {baseUrl}?device_id={deviceId}</p>
                  <p className="font-mono">Authorization: Bearer [token]</p>
                  <p className="font-mono">Body: {`{"markup":"<html>..."}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
