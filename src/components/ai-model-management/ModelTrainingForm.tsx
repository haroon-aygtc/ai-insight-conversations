import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Database, Layers, Settings, Play } from "lucide-react";

interface ModelTrainingFormProps {
  onSubmit: (formData: any) => void;
  isEdit?: boolean;
  initialData?: any;
}

const ModelTrainingForm: React.FC<ModelTrainingFormProps> = ({
  onSubmit,
  isEdit = false,
  initialData = {},
}) => {
  const [formData, setFormData] = React.useState({
    name: initialData.name || "",
    description: initialData.description || "",
    modelType: initialData.modelType || "classification",
    datasetId: initialData.datasetId || "",
    trainingRatio: initialData.trainingRatio || 80,
    validationRatio: initialData.validationRatio || 10,
    testRatio: initialData.testRatio || 10,
    epochs: initialData.epochs || 10,
    batchSize: initialData.batchSize || 32,
    learningRate: initialData.learningRate || 0.001,
    optimizer: initialData.optimizer || "adam",
    lossFunction: initialData.lossFunction || "categorical_crossentropy",
    enableEarlyStopping: initialData.enableEarlyStopping || true,
    enableCheckpoints: initialData.enableCheckpoints || true,
    enableDataAugmentation: initialData.enableDataAugmentation || false,
    enableTransferLearning: initialData.enableTransferLearning || false,
    baseModel: initialData.baseModel || "",
    notes: initialData.notes || "",
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Mock datasets for the select dropdown
  const datasets = [
    { id: "dataset1", name: "Customer Churn Dataset", records: 15000 },
    { id: "dataset2", name: "Product Classification Images", records: 8500 },
    { id: "dataset3", name: "Sentiment Analysis Texts", records: 25000 },
    { id: "dataset4", name: "Sales Forecasting Data", records: 5200 },
  ];

  // Mock base models for transfer learning
  const baseModels = [
    { id: "resnet50", name: "ResNet50", type: "vision" },
    { id: "vgg16", name: "VGG16", type: "vision" },
    { id: "bert", name: "BERT", type: "nlp" },
    { id: "gpt2", name: "GPT-2 Small", type: "nlp" },
    { id: "mobilenet", name: "MobileNet", type: "vision" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Model" : "Create New Model"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="text-xs">
                <Layers className="mr-1 h-3.5 w-3.5" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs">
                <Database className="mr-1 h-3.5 w-3.5" />
                Data
              </TabsTrigger>
              <TabsTrigger value="training" className="text-xs">
                <Settings className="mr-1 h-3.5 w-3.5" />
                Training
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">
                <Play className="mr-1 h-3.5 w-3.5" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Model Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter model name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Describe the purpose and features of this model"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelType">Model Type</Label>
                  <Select
                    value={formData.modelType}
                    onValueChange={(value) => handleChange("modelType", value)}
                  >
                    <SelectTrigger id="modelType">
                      <SelectValue placeholder="Select model type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classification">
                        Classification
                      </SelectItem>
                      <SelectItem value="regression">Regression</SelectItem>
                      <SelectItem value="nlp">
                        Natural Language Processing
                      </SelectItem>
                      <SelectItem value="vision">Computer Vision</SelectItem>
                      <SelectItem value="timeseries">Time Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="datasetId">Select Dataset</Label>
                  <Select
                    value={formData.datasetId}
                    onValueChange={(value) => handleChange("datasetId", value)}
                  >
                    <SelectTrigger id="datasetId">
                      <SelectValue placeholder="Select a dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasets.map((dataset) => (
                        <SelectItem key={dataset.id} value={dataset.id}>
                          {dataset.name} ({dataset.records.toLocaleString()}{" "}
                          records)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Data Split Ratio</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Train: {formData.trainingRatio}%
                    </Badge>
                    <Badge variant="outline">
                      Validation: {formData.validationRatio}%
                    </Badge>
                    <Badge variant="outline">Test: {formData.testRatio}%</Badge>
                  </div>
                </div>

                <div className="space-y-4 rounded-md bg-slate-50 p-3">
                  <div className="space-y-2">
                    <Label htmlFor="trainingRatio" className="text-xs">
                      Training: {formData.trainingRatio}%
                    </Label>
                    <Slider
                      id="trainingRatio"
                      min={50}
                      max={90}
                      step={5}
                      value={[formData.trainingRatio]}
                      onValueChange={(value) => {
                        const remaining = 100 - value[0];
                        handleChange("trainingRatio", value[0]);
                        handleChange(
                          "validationRatio",
                          Math.floor(remaining / 2),
                        );
                        handleChange("testRatio", Math.ceil(remaining / 2));
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="validationRatio" className="text-xs">
                        Validation: {formData.validationRatio}%
                      </Label>
                      <Slider
                        id="validationRatio"
                        min={5}
                        max={25}
                        step={5}
                        value={[formData.validationRatio]}
                        onValueChange={(value) => {
                          handleChange("validationRatio", value[0]);
                          handleChange(
                            "testRatio",
                            100 - formData.trainingRatio - value[0],
                          );
                        }}
                        disabled={formData.trainingRatio >= 90}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="testRatio" className="text-xs">
                        Test: {formData.testRatio}%
                      </Label>
                      <Slider
                        id="testRatio"
                        min={5}
                        max={25}
                        step={5}
                        value={[formData.testRatio]}
                        onValueChange={(value) => {
                          handleChange("testRatio", value[0]);
                          handleChange(
                            "validationRatio",
                            100 - formData.trainingRatio - value[0],
                          );
                        }}
                        disabled={formData.trainingRatio >= 90}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="enableDataAugmentation"
                    className="cursor-pointer"
                  >
                    Enable Data Augmentation
                  </Label>
                  <Switch
                    id="enableDataAugmentation"
                    checked={formData.enableDataAugmentation}
                    onCheckedChange={(checked) =>
                      handleChange("enableDataAugmentation", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Upload className="h-3.5 w-3.5" />
                    Upload New Dataset
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Database className="h-3.5 w-3.5" />
                    Manage Datasets
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="training" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="epochs">Epochs</Label>
                    <Input
                      id="epochs"
                      type="number"
                      min="1"
                      max="1000"
                      value={formData.epochs}
                      onChange={(e) =>
                        handleChange("epochs", parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batchSize">Batch Size</Label>
                    <Select
                      value={formData.batchSize.toString()}
                      onValueChange={(value) =>
                        handleChange("batchSize", parseInt(value))
                      }
                    >
                      <SelectTrigger id="batchSize">
                        <SelectValue placeholder="Select batch size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="32">32</SelectItem>
                        <SelectItem value="64">64</SelectItem>
                        <SelectItem value="128">128</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="learningRate">Learning Rate</Label>
                    <Select
                      value={formData.learningRate.toString()}
                      onValueChange={(value) =>
                        handleChange("learningRate", parseFloat(value))
                      }
                    >
                      <SelectTrigger id="learningRate">
                        <SelectValue placeholder="Select learning rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.1">0.1</SelectItem>
                        <SelectItem value="0.01">0.01</SelectItem>
                        <SelectItem value="0.001">0.001</SelectItem>
                        <SelectItem value="0.0001">0.0001</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="optimizer">Optimizer</Label>
                    <Select
                      value={formData.optimizer}
                      onValueChange={(value) =>
                        handleChange("optimizer", value)
                      }
                    >
                      <SelectTrigger id="optimizer">
                        <SelectValue placeholder="Select optimizer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adam">Adam</SelectItem>
                        <SelectItem value="sgd">SGD</SelectItem>
                        <SelectItem value="rmsprop">RMSprop</SelectItem>
                        <SelectItem value="adagrad">Adagrad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lossFunction">Loss Function</Label>
                  <Select
                    value={formData.lossFunction}
                    onValueChange={(value) =>
                      handleChange("lossFunction", value)
                    }
                  >
                    <SelectTrigger id="lossFunction">
                      <SelectValue placeholder="Select loss function" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="categorical_crossentropy">
                        Categorical Crossentropy
                      </SelectItem>
                      <SelectItem value="binary_crossentropy">
                        Binary Crossentropy
                      </SelectItem>
                      <SelectItem value="mse">Mean Squared Error</SelectItem>
                      <SelectItem value="mae">Mean Absolute Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="enableEarlyStopping"
                      className="cursor-pointer"
                    >
                      Enable Early Stopping
                    </Label>
                    <Switch
                      id="enableEarlyStopping"
                      checked={formData.enableEarlyStopping}
                      onCheckedChange={(checked) =>
                        handleChange("enableEarlyStopping", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="enableCheckpoints"
                      className="cursor-pointer"
                    >
                      Save Model Checkpoints
                    </Label>
                    <Switch
                      id="enableCheckpoints"
                      checked={formData.enableCheckpoints}
                      onCheckedChange={(checked) =>
                        handleChange("enableCheckpoints", checked)
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="enableTransferLearning"
                      className="cursor-pointer"
                    >
                      Enable Transfer Learning
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Use a pre-trained model as a starting point
                    </p>
                  </div>
                  <Switch
                    id="enableTransferLearning"
                    checked={formData.enableTransferLearning}
                    onCheckedChange={(checked) =>
                      handleChange("enableTransferLearning", checked)
                    }
                  />
                </div>

                {formData.enableTransferLearning && (
                  <div className="space-y-2">
                    <Label htmlFor="baseModel">Base Model</Label>
                    <Select
                      value={formData.baseModel}
                      onValueChange={(value) =>
                        handleChange("baseModel", value)
                      }
                    >
                      <SelectTrigger id="baseModel">
                        <SelectValue placeholder="Select base model" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseModels
                          .filter(
                            (model) =>
                              (formData.modelType === "vision" &&
                                model.type === "vision") ||
                              (formData.modelType === "nlp" &&
                                model.type === "nlp") ||
                              formData.modelType === "classification" ||
                              formData.modelType === "regression",
                          )
                          .map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Additional notes about this model training"
                    rows={3}
                  />
                </div>

                <div className="rounded-md bg-slate-50 p-3">
                  <h4 className="mb-2 text-xs font-medium">
                    Hardware Requirements
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-medium">Estimated Training Time</p>
                      <p className="text-muted-foreground">
                        {formData.epochs <= 10
                          ? "10-30 minutes"
                          : formData.epochs <= 50
                            ? "1-3 hours"
                            : "3+ hours"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Recommended Hardware</p>
                      <p className="text-muted-foreground">
                        {formData.modelType === "vision" || formData.epochs > 50
                          ? "GPU Instance"
                          : "Standard Instance"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? "Update Model" : "Create Model"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ModelTrainingForm;
