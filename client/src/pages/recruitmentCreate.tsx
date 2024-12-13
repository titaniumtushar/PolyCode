import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";

interface Stage {
  stage_name: string;
  stage_type: string;
  description?: string;
  id?: string;
}

const CreateRecruitmentDrive: React.FC = () => {
  const [driveName, setDriveName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStage, setCurrentStage] = useState<Stage>({ stage_name: "", stage_type: "" });
  const [isStageDialogOpen, setIsStageDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAddStage = () => {
    setStages([...stages, currentStage]);
    setCurrentStage({ stage_name: "", stage_type: "" });
    setIsStageDialogOpen(false);
  };
  const handleSubmit = async () => {
    if (!driveName || !startDate || !endDate || !companyId || stages.length === 0) {
      alert("Please fill all required fields, provide a company ID, and add at least one stage.");
      return;
    }
  
    try {
      const formattedStages = stages.map(({ id, ...stage }) => ({
        ...stage,
        stage_id: id, // Map id to stage_id
      }));
  
      const response = await fetch(`${API_URL}/api/community/create/drive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          drive_name: driveName,
          start_date: new Date(startDate).getTime(),
          end_date: new Date(endDate).getTime(),
          description,
          stages: formattedStages, // Use formatted stages with stage_id
          company_id: companyId,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Recruitment Drive Created Successfully!");
        navigate("/dashboard");
      } else {
        console.error("Error:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating recruitment drive:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(to bottom, #6a11cb, #ff8c00)",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create Recruitment Drive
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Drive Name"
              fullWidth
              variant="outlined"
              value={driveName}
              onChange={(e) => setDriveName(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="Start Date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true, style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="End Date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true, style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Company ID"
              fullWidth
              variant="outlined"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsStageDialogOpen(true)}
            >
              Add Stage
            </Button>

            <TableContainer component={Paper} style={{ marginTop: "20px", background: "rgba(0,0,0,0.3)" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "white" }}>Stage Name</TableCell>
                    <TableCell style={{ color: "white" }}>Stage Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stages.map((stage, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ color: "white" }}>{stage.stage_name}</TableCell>
                      <TableCell style={{ color: "white" }}>{stage.stage_type}</TableCell>
                      <Accordion style={{ background: "rgba(255,255,255,0.1)" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
                          style={{ color: "white" }}
                        >
                          Add ID for {stage.stage_type}
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            label={`${stage.stage_type} ID`}
                            fullWidth
                            variant="outlined"
                            value={stage.id || ""}
                            onChange={(e) => {
                              const newStages = [...stages];
                              newStages[index].id = e.target.value;
                              setStages(newStages);
                            }}
                            InputLabelProps={{ style: { color: "white" } }}
                            inputProps={{ style: { color: "white" } }}
                          />
                        </AccordionDetails>
                      </Accordion>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Create Drive
            </Button>
          </Grid>
        </Grid>

        <Dialog open={isStageDialogOpen} onClose={() => setIsStageDialogOpen(false)}>
          <DialogTitle>Add Stage</DialogTitle>
          <DialogContent>
            <TextField
              label="Stage Name"
              fullWidth
              variant="outlined"
              value={currentStage.stage_name}
              onChange={(e) =>
                setCurrentStage({ ...currentStage, stage_name: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />

            <Select
              value={currentStage.stage_type}
              onChange={(e) =>
                setCurrentStage({ ...currentStage, stage_type: e.target.value })
              }
              fullWidth
              variant="outlined"
              style={{ marginBottom: "10px" }}
            >
              <MenuItem value="Quiz">Quiz</MenuItem>
              <MenuItem value="Contest">Contest</MenuItem>
              <MenuItem value="Interview">Interview</MenuItem>
            </Select>

            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={currentStage.description}
              onChange={(e) =>
                setCurrentStage({ ...currentStage, description: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsStageDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddStage} color="primary">
              Add Stage
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default CreateRecruitmentDrive;