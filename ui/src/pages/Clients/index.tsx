import { memo, useContext, useState, useEffect, Fragment } from "react";
import { 
  Container
  , Paper
  , Typography 
  , Grid
  , InputBase
  , IconButton
  , Button
  , TableContainer
  , Table
  , TableHead
  , TableBody
  , TableRow
  , TableCell
  , Dialog
  , DialogTitle
  , DialogContent
  , Box
  , Stepper 
  , Step 
  , StepLabel
  , TextField
} from "@mui/material";
// import { Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Page from "../../components/Page";
import { getFilteredClients, createClient } from "../../services/api";
import { StateContext } from "../../store/DataProvider";

const steps = ['Personal details', 'Contact details'];

function Clients() {
  const { state, dispatch } = useContext(StateContext);
  
  const [open, setOpen] = useState(false);
  const handleDialogClickOpen = () => { 
    handleReset();
    setOpen(true); 
  };
  const handleDialogClose = () => { 
    handleReset();
    setOpen(false);
   };

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const isStepOptional = (step: number) => {
    return step === -1;
  };
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };
  const handleNext = () => {
    if (activeStep === steps.length - 1 )
    {
      AddClient();
      handleDialogClose();
    }
    
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setActiveStep(0);
  };

  let { clients } = state;
  let filterValue = "";

  let [firstName,setFirstName] = useState("");
  let [lastName,setLastName] = useState("");
  let [email,setEmail] = useState("");
  let [phoneNumber,setPhoneNumber] = useState("");

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    filterValue = event.target.value;
    GetClients();
  };

  function GetClients()
  {
    getFilteredClients(filterValue).then((clients) =>
      dispatch({ type: "FETCH_ALL_CLIENTS", data: clients })
    );
  }

  function AddClient()
  {
    filterValue = "";
    const client: IClient = 
    { 
      id: new Date().toISOString(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber
    };
    createClient(client).then(() => 
      GetClients()
    ).then(() => 
      handleReset()
    );
  }

  function HasStrValue(str: string)
  {
    return str.length === 0;
  }
  
  function CreateReady()
  {
    return firstName.length !== 0
    && lastName.length !== 0
    && email.length !== 0
    && phoneNumber.length !== 0;
  }

  useEffect(() => { 
    getFilteredClients("").then((clients) =>
      dispatch({ type: "FETCH_ALL_CLIENTS", data: clients })
    );
  }, [dispatch]);

  return (
    <Page>
      <Container maxWidth="md">
        <Typography variant="h5" sx={{textAlign: "start", marginBottom: 2}}>
          Clients
        </Typography>
        <Grid container>
          <Grid item xs={12} md={4} textAlign="left">
            <Paper elevation={0} component="form" sx={{display: 'flex', alignItems: 'center' }}>
              <InputBase sx={{ ml: 1, flex: 1 }} 
                placeholder="Search clients..." 
                inputProps={{ 'aria-label': 'Search clients...' }} 
                onChange={onChangeSearch}
                />
              <IconButton type="button" aria-label="Search">
                <SearchIcon />
              </IconButton>
              {/* <IconButton type="button" aria-label="Create new client" 
                sx={{color: `primary.light`}}
                onClick={() => {AddClient();}}
                >
                <Add />
              </IconButton> */}
            </Paper>
          </Grid>
          <Grid item xs={0} md={5}></Grid>
          <Grid item xs={12} md={3} textAlign="right">
            <Button variant="contained" disableElevation 
              sx={{textTransform: 'capitalize'}} 
              onClick={handleDialogClickOpen}
              fullWidth>
              Create new client
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} elevation={0} sx={{ margin: "auto", marginTop: 3 }}>
          <Table aria-label="Client list">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                    // "&:hover": { backgroundColor: "#f5f5f5", },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{color: `primary.light`}}>
                    {client.firstName} {client.lastName}
                  </TableCell>
                  <TableCell>{client.phoneNumber}</TableCell>
                  <TableCell>{client.email}</TableCell>
                </TableRow>
              ))}
              {!clients ||
                (!clients.length && (
                  <TableRow sx={{ padding: 3 }}>
                    <TableCell component="th" scope="row">
                      No clients
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Fragment>
          <Dialog
            open={open}
            onClose={handleDialogClose}
            maxWidth="lg"
          >
            <DialogTitle>Create new client</DialogTitle>
            <DialogContent>
              {/* ************************************STEPPER */}
              <Box sx={{ }}>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                      optional?: React.ReactNode;
                    } = {};
                    if (isStepOptional(index)) {
                      labelProps.optional = (
                        <Typography variant="caption">Optional</Typography>
                      );
                    }
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {activeStep === steps.length ? (
                  <Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </Fragment>
                ) : (
                  <Fragment>
                    {activeStep === 0 ? (
                      <Box sx={{m: 1, mt: 2}}>
                        <TextField fullWidth sx={{m: 1}}
                            id="outlined-required"
                            label={"First name" + (HasStrValue(firstName) ? ' is required' : '')}
                            size="small"
                            required
                            value={firstName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setFirstName(event.target.value);
                            }}
                            error={HasStrValue(firstName)}
                          />
                        <TextField fullWidth sx={{m: 1}}
                            id="outlined-required"
                            label={"Last name" + (HasStrValue(lastName) ? ' is required' : '')}
                            size="small"
                            required
                            value={lastName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setLastName(event.target.value);
                            }}
                            error={HasStrValue(lastName)}
                          />
                      </Box>
                    ) : (
                      <Box sx={{m: 1, mt: 2}}>
                        <TextField fullWidth sx={{m: 1}}
                            id="outlined-required"
                            label={"Email" + (HasStrValue(email) ? ' is required' : '')}
                            size="small"
                            required
                            value={email}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setEmail(event.target.value);
                            }}
                            error={HasStrValue(email)}
                          />
                        <TextField fullWidth sx={{m: 1}}
                            id="outlined-required"
                            label={"Phone number" + (HasStrValue(phoneNumber) ? ' is required' : '')}
                            size="small"
                            required
                            value={phoneNumber}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setPhoneNumber(event.target.value);
                            }}
                            error={HasStrValue(phoneNumber)}
                          />
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1, textTransform: 'capitalize', color: `primary.light` }}
                      >
                        <ArrowBack fontSize="small" /> Back
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      {isStepOptional(activeStep) && (
                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                          Skip
                        </Button>
                      )}
                      <Button variant="contained" disableElevation 
                        sx={{textTransform: 'capitalize'}}  
                        onClick={handleNext}
                        disabled={!CreateReady() && activeStep === steps.length - 1}
                        >
                        {activeStep === steps.length - 1 ? 'Create Client' : 'Continue'}
                      </Button>
                    </Box>
                  </Fragment>
                )}
              </Box>
            </DialogContent>
          </Dialog>
        </Fragment>
      </Container>
    </Page>
  );
}

export default memo(Clients);