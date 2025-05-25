import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, RefreshCw, Download, Upload, BarChart2 } from "lucide-react";
import ModelCard from "@/components/ai-model-management/ModelCard";
import ModelFilters from "@/components/ai-model-management/ModelFilters";
import ModelMetricsCard from "@/components/ai-model-management/ModelMetricsCard";
import ModelVersionHistory from "@/components/ai-model-management/ModelVersionHistory";
import ModelDeploymentSettings from "@/components/ai-model-management/ModelDeploymentSettings";
import ModelTrainingForm from "@/components/ai-model-management/ModelTrainingForm";

const AIModelManagement = () => {
  const [activeTab, setActiveTab] = useState("models");
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isCreatingModel, setIsCreatingModel] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Mock data for models
  const models = [
    {
      id: "model1",
      name: "Customer Churn Predictor",
      description:
        "Predicts likelihood of customer churn based on usage patterns and demographics",
      status: "active" as const,
      type: "classification",
      version: "v2.3.0",
      lastUpdated: "2023-10-15",
      accuracy: 94.2,
    },
    {
      id: "model2",
      name: "Product Recommendation Engine",
      description:
        "Recommends products based on user browsing and purchase history",
      status: "active" as const,
      type: "regression",
      version: "v1.5.2",
      lastUpdated: "2023-09-28",
      accuracy: 88.7,
    },
    {
      id: "model3",
      name: "Sentiment Analysis Model",
      description:
        "Analyzes customer feedback and social media mentions for sentiment",
      status: "training" as const,
      type: "nlp",
      version: "v3.0.0-beta",
      lastUpdated: "2023-10-20",
      trainingProgress: 68,
    },
    {
      id: "model4",
      name: "Image Classification System",
      description: "Classifies product images for automated categorization",
      status: "error" as const,
      type: "vision",
      version: "v1.2.1",
      lastUpdated: "2023-10-05",
    },
    {
      id: "model5",
      name: "Sales Forecasting Model",
      description:
        "Predicts future sales based on historical data and seasonal trends",
      status: "draft" as const,
      type: "timeseries",
      version: "v0.9.0",
      lastUpdated: "2023-10-18",
    },
    {
      id: "model6",
      name: "Fraud Detection System",
      description:
        "Identifies potentially fraudulent transactions in real-time",
      status: "active" as const,
      type: "classification",
      version: "v2.1.0",
      lastUpdated: "2023-09-12",
      accuracy: 97.3,
    },
  ];

  // Mock data for version history
  const versionHistory = [
    {
      id: "v1",
      version: "v2.3.0",
      date: "2023-10-15",
      accuracy: 94.2,
      status: "active" as const,
      size: "45.2 MB",
      commitMessage:
        "Improved feature extraction and added new demographic variables",
    },
    {
      id: "v2",
      version: "v2.2.0",
      date: "2023-09-30",
      accuracy: 93.1,
      status: "archived" as const,
      size: "44.8 MB",
      commitMessage: "Optimized model performance and reduced inference time",
    },
    {
      id: "v3",
      version: "v2.1.0",
      date: "2023-09-15",
      accuracy: 92.5,
      status: "archived" as const,
      size: "43.5 MB",
      commitMessage: "Added support for international customer data",
    },
    {
      id: "v4",
      version: "v2.0.0",
      date: "2023-08-22",
      accuracy: 90.8,
      status: "archived" as const,
      size: "42.1 MB",
      commitMessage: "Major architecture update with improved accuracy",
    },
    {
      id: "v5",
      version: "v1.5.0",
      date: "2023-07-10",
      accuracy: 87.3,
      status: "archived" as const,
      size: "38.6 MB",
      commitMessage: "Added new features based on customer feedback",
    },
  ];

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch = search
      ? model.name.toLowerCase().includes(search.toLowerCase()) ||
        model.description.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesStatus = statusFilter ? model.status === statusFilter : true;
    const matchesType = typeFilter ? model.type === typeFilter : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSelectModel = (id: string) => {
    setSelectedModelId(id);
    setActiveTab("details");
  };

  const handleCreateModel = (formData: any) => {
    console.log("Creating model with data:", formData);
    setIsCreatingModel(false);
    // In a real app, you would create the model and update the list
  };

  const handleCompareVersions = (versionIds: string[]) => {
    console.log("Comparing versions:", versionIds);
    // In a real app, you would show a comparison view
  };

  const handleRevertVersion = (versionId: string) => {
    console.log("Reverting to version:", versionId);
    // In a real app, you would revert to the selected version
  };

  const handleDownloadVersion = (versionId: string) => {
    console.log("Downloading version:", versionId);
    // In a real app, you would trigger a download
  };

  const handleSaveDeploymentSettings = (settings: any) => {
    console.log("Saving deployment settings:", settings);
    // In a real app, you would save the settings
  };

  const handleDeployModel = () => {
    console.log("Deploying model:", selectedModelId);
    // In a real app, you would trigger the deployment process
  };

  const selectedModel = models.find((model) => model.id === selectedModelId);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Model Management</h1>
          <p className="text-muted-foreground">
            Create, train, deploy, and monitor your machine learning models
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "models" && (
            <Button onClick={() => setIsCreatingModel(true)}>
              <Plus className="mr-1 h-4 w-4" />
              New Model
            </Button>
          )}
          {activeTab === "details" && selectedModel && (
            <Button variant="outline" onClick={() => setActiveTab("models")}>
              Back to Models
            </Button>
          )}
        </div>
      </div>

      {isCreatingModel ? (
        <div className="max-w-4xl mx-auto">
          <ModelTrainingForm onSubmit={handleCreateModel} />
        </div>
      ) : activeTab === "models" ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Upload className="h-3.5 w-3.5" />
                Import
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <BarChart2 className="h-3.5 w-3.5" />
                Analytics
              </Button>
            </div>
          </div>

          <ModelFilters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            clearFilters={clearFilters}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                id={model.id}
                name={model.name}
                description={model.description}
                status={model.status}
                type={model.type}
                version={model.version}
                lastUpdated={model.lastUpdated}
                accuracy={model.accuracy}
                trainingProgress={model.trainingProgress}
                onSelect={handleSelectModel}
              />
            ))}

            {filteredModels.length === 0 && (
              <div className="col-span-3 py-12 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3 className="font-medium">No models found</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        selectedModel && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{selectedModel.name}</h2>
              {selectedModel.status === "active" && (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Active
                </span>
              )}
            </div>

            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
                <TabsTrigger value="deployment">Deployment</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <ModelMetricsCard modelId={selectedModel.id} />
                    </div>
                    <div>
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Model Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">
                                Type
                              </dt>
                              <dd className="mt-1">{selectedModel.type}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">
                                Version
                              </dt>
                              <dd className="mt-1">{selectedModel.version}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">
                                Last Updated
                              </dt>
                              <dd className="mt-1">
                                {selectedModel.lastUpdated}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">
                                Description
                              </dt>
                              <dd className="mt-1">
                                {selectedModel.description}
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="versions">
                  <ModelVersionHistory
                    versions={versionHistory}
                    onCompare={handleCompareVersions}
                    onRevert={handleRevertVersion}
                    onDownload={handleDownloadVersion}
                  />
                </TabsContent>

                <TabsContent value="deployment">
                  <ModelDeploymentSettings
                    modelId={selectedModel.id}
                    onSave={handleSaveDeploymentSettings}
                    onDeploy={handleDeployModel}
                  />
                </TabsContent>

                <TabsContent value="monitoring">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Inference Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          {/* Placeholder for chart */}
                          <div className="flex h-full w-full items-center justify-center rounded border border-dashed">
                            <p className="text-sm text-muted-foreground">
                              Inference metrics chart
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Usage Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          {/* Placeholder for chart */}
                          <div className="flex h-full w-full items-center justify-center rounded border border-dashed">
                            <p className="text-sm text-muted-foreground">
                              Usage statistics chart
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )
      )}
    </div>
  );
};

export default AIModelManagement;
