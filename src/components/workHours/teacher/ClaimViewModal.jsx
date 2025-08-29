import React, { useEffect, useRef, useState } from "react";
import {
    Dialog,
    IconButton,
    Typography,
    Stack,
    Badge,
    Box,
    Paper,
    TextField,
    AppBar,
    Toolbar,
    Slide,
    CircularProgress,
    Avatar,
    Tooltip,
    Divider,
    Chip,
    Card,
    CardContent,
    Fade,
    useTheme,
    alpha,
    Container,
    InputAdornment,
} from "@mui/material";
import {
    Close as CloseIcon,
    Message,
    Send as SendIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Description as DescriptionIcon,
    Chat as ChatIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
    createClaimComment,
    getAllComments,
    getByWorkHourId,
} from "../../../features/claimSlice";
import { blueGrey, deepPurple, green, grey } from "@mui/material/colors";
import socket from "../../../socket/socket";
import { MessageCircle } from "lucide-react";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ClaimViewModal = ({ idWorkHour, commentsCount }) => {
    const [open, setOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [messagesVisible, setMessagesVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { claim, isClaimLoading } = useSelector((state) => state.claim);

    const messagesEndRef = useRef(null);
    const currentUserId = user?.user?.id;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Socket effects
    useEffect(() => {
        if (!claim?.id) return;       

        socket.emit("join-claim", claim.id);

        const handleReceiveComment = (newComment) => {
            if (newComment.claimId === claim.id) {
                setComments((prev) => [...prev, newComment]);
                scrollToBottom();
            }
        };

        socket.on("receive-comment", handleReceiveComment);

        return () => {
            socket.off("receive-comment", handleReceiveComment);
            socket.emit("leave-claim", claim.id);
        };
    }, [claim?.id]);

    const handleOpen = async () => {
        setOpen(true);
        setLoadingComments(true);
        try {
            const claim = await dispatch(getByWorkHourId(idWorkHour)).unwrap();
            if(claim?.id){
                const data = await dispatch(getAllComments(claim.id)).unwrap();
                setComments(data);
            }
            setMessagesVisible(true);
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error("Error al obtener reclamo:", err);
        } finally {
            setLoadingComments(false);
            setMessagesVisible(true);
        }
    };

    const handleSend = () => {
        if (!replyText.trim() || !claim?.id) return;

        const newComment = {
            claimId: claim.id,
            content: replyText.trim(),
            authorId: currentUserId
        };

        dispatch(createClaimComment(newComment)).unwrap();
        socket.emit("send-comment", newComment);
        setReplyText("");
    };

    const handleClose = () => {
        setOpen(false);
        setReplyText("");
        setMessagesVisible(false);
        setComments([]);
    };

    const getRoleConfig = (role) => {
        const configs = {
            ADMIN: { 
                color: blueGrey[600], 
                label: "Administrador",
                textColor: "#fff"
            },
            SECRETARY: { 
                color: deepPurple[600], 
                label: "Secretario",
                textColor: "#fff"
            },
            TEACHER: { 
                color: green[600], 
                label: "Docente",
                textColor: "#fff"
            },
            default: { 
                color: grey[500], 
                label: "Usuario",
                textColor: "#fff"
            }
        };
        return configs[role] || configs.default;
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })?.format(new Date(date));
    };

    if (!currentUserId) return null;

    return (
        <>
            <Tooltip title="Ver reclamación" placement="top">
                <IconButton 
                    color="primary" 
                    onClick={handleOpen}
                    sx={{
                        borderRadius: 2,
                    }}
                >
                    <Badge 
                        badgeContent={commentsCount} 
                        color="error"
                        sx={{
                            '& .MuiBadge-badge': {
                                fontSize: '0.7rem',
                                height: 18,
                                minWidth: 18,
                            }
                        }}
                    >
                        <MessageCircle />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                {/* Header mejorado */}
                <AppBar 
                    position="sticky" 
                    color="inherit" 
                    elevation={0}
                    sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ChatIcon color="primary" />
                            <Box>
                                <Typography variant="h6" color="text.primary" fontWeight={600}>
                                    {claim ? claim.title : "Cargando..."}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Reclamación #{claim?.id}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton 
                            edge="end" 
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="xl" sx={{ py: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {isClaimLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                            <Stack alignItems="center" spacing={2}>
                                <CircularProgress size={48} />
                                <Typography variant="body2" color="text.secondary">
                                    Cargando reclamación...
                                </Typography>
                            </Stack>
                        </Box>
                    ) : (
                        <Stack direction={['column', 'column', 'row']} gap={1}>
                            {/* Columna izquierda - Información del reclamo */}
                            <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
                                <Card elevation={2} sx={{ borderRadius: 1 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack spacing={3}>
                                            {/* Docente */}
                                            <Box>
                                                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                                    <PersonIcon color="primary" fontSize="small" />
                                                    <Typography variant="subtitle2" color="primary" fontWeight={600}>
                                                        Docente
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: getRoleConfig('TEACHER').color,
                                                            width: 40,
                                                            height: 40,
                                                        }}
                                                    >
                                                        {claim?.teacher?.user?.name?.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {claim?.teacher?.user?.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            DNI: {claim?.teacher?.user?.dni}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>

                                            <Divider />

                                            {/* Descripción */}
                                            <Box>
                                                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                                    <DescriptionIcon color="primary" fontSize="small" />
                                                    <Typography variant="subtitle2" color="primary" fontWeight={600}>
                                                        Descripción
                                                    </Typography>
                                                </Stack>
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        p: 2,
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                        borderColor: alpha(theme.palette.primary.main, 0.1),
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            whiteSpace: "pre-wrap",
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        {claim?.description}
                                                    </Typography>
                                                </Paper>
                                            </Box>

                                            <Divider />

                                            {/* Fecha */}
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <ScheduleIcon color="action" fontSize="small" />
                                                <Typography variant="caption" color="text.secondary">
                                                    {/* Creado el {formatDate(claim?.createdAt)} */}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>

                            {/* Columna derecha - Sección de conversación */}
                            <Stack sx={{ flex: 1, minWidth: 0 }}>
                                <Card elevation={2} sx={{ borderRadius: 1, flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        {/* Header de conversación */}
                                        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <ChatIcon color="primary" />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        Conversación
                                                    </Typography>
                                                    {comments.length > 0 && (
                                                        <Chip 
                                                            label={`${comments.length} mensajes`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Box>

                                        {/* Área de mensajes */}
                                        <Box sx={{ flex: 1, p: 2, overflow: 'auto', minHeight: 400 }}>
                                            {loadingComments ? (
                                                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                                    <Stack alignItems="center" spacing={2}>
                                                        <CircularProgress size={32} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Cargando conversación...
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            ) : messagesVisible ? (
                                                <Fade in={messagesVisible}>
                                                    <Stack spacing={2}>
                                                        {comments.length === 0 ? (
                                                            <Box 
                                                                display="flex" 
                                                                flexDirection="column" 
                                                                alignItems="center" 
                                                                justifyContent="center"
                                                                py={6}
                                                            >
                                                                <ChatIcon 
                                                                    sx={{ 
                                                                        fontSize: 48, 
                                                                        color: grey[400],
                                                                        mb: 2 
                                                                    }} 
                                                                />
                                                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                                                    Aún no hay mensajes
                                                                </Typography>
                                                                <Typography variant="body2" color="text.disabled">
                                                                    Sé el primero en comentar esta reclamación
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            comments.map((comment) => {
                                                                const isOwn = comment.author?.id === currentUserId;
                                                                const roleConfig = getRoleConfig(comment.author?.role);
                                                                
                                                                return (
                                                                    <Box
                                                                        key={comment.id}
                                                                        display="flex"
                                                                        justifyContent={isOwn ? "flex-end" : "flex-start"}
                                                                    >
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={2}
                                                                            alignItems="flex-start"
                                                                            sx={{
                                                                                maxWidth: "80%",
                                                                                flexDirection: isOwn ? "row-reverse" : "row",
                                                                            }}
                                                                        >
                                                                            <Avatar
                                                                                sx={{
                                                                                    bgcolor: roleConfig.color,
                                                                                    width: 35,
                                                                                    height: 35,
                                                                                    fontSize: '0.9rem',
                                                                                }}
                                                                            >
                                                                                {comment.author?.name?.charAt(0)}
                                                                            </Avatar>
                                                                            <Stack spacing={0.5}>
                                                                                <Paper
                                                                                    elevation={3}
                                                                                    sx={{
                                                                                        p: 1,
                                                                                        borderRadius: 1,
                                                                                        bgcolor: roleConfig.color,
                                                                                        color: roleConfig.textColor,
                                                                                        position: 'relative',
                                                                                        '&::before': isOwn ? {} : {
                                                                                            content: '""',
                                                                                            position: 'absolute',
                                                                                            top: 12,
                                                                                            left: -6,
                                                                                            width: 0,
                                                                                            height: 0,
                                                                                            borderStyle: 'solid',
                                                                                            borderWidth: '6px 6px 6px 0',
                                                                                            borderColor: `transparent ${roleConfig.color} transparent transparent`,
                                                                                        },
                                                                                        '&::after': !isOwn ? {} : {
                                                                                            content: '""',
                                                                                            position: 'absolute',
                                                                                            top: 12,
                                                                                            right: -6,
                                                                                            width: 0,
                                                                                            height: 0,
                                                                                            borderStyle: 'solid',
                                                                                            borderWidth: '6px 0 6px 6px',
                                                                                            borderColor: `transparent transparent transparent ${roleConfig.color}`,
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        sx={{ 
                                                                                            whiteSpace: "pre-wrap",
                                                                                            lineHeight: 1.5,
                                                                                        }}
                                                                                    >
                                                                                        {comment.content}
                                                                                    </Typography>
                                                                                </Paper>
                                                                                <Box sx={{ px: 1, textAlign: isOwn ? 'right' : 'left' }}>
                                                                                    <Stack 
                                                                                        direction="row" 
                                                                                        spacing={1} 
                                                                                        alignItems="center"
                                                                                        justifyContent={isOwn ? 'flex-end' : 'flex-start'}
                                                                                    >
                                                                                        <Chip
                                                                                            label={roleConfig.label}
                                                                                            size="small"
                                                                                            sx={{
                                                                                                bgcolor: alpha(roleConfig.color, 0.1),
                                                                                                color: roleConfig.color,
                                                                                                fontSize: '0.7rem',
                                                                                                height: 20,
                                                                                                '& .MuiChip-label': {
                                                                                                    px: 1,
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                        <Typography
                                                                                            variant="caption"
                                                                                            color="text.secondary"
                                                                                            fontSize={10}
                                                                                        >
                                                                                            {comment.author?.name} • {formatDate(comment.createdAt)}
                                                                                        </Typography>
                                                                                    </Stack>
                                                                                </Box>
                                                                            </Stack>
                                                                        </Stack>
                                                                    </Box>
                                                                );
                                                            })
                                                        )}
                                                        <div ref={messagesEndRef} />
                                                    </Stack>
                                                </Fade>
                                            ) : (
                                                <Box 
                                                    display="flex" 
                                                    flexDirection="column" 
                                                    alignItems="center" 
                                                    justifyContent="center"
                                                    height="100%"
                                                    py={6}
                                                >
                                                    <Message 
                                                        sx={{ 
                                                            fontSize: 64, 
                                                            color: grey[300],
                                                            mb: 2 
                                                        }} 
                                                    />
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                                        Ver conversación
                                                    </Typography>
                                                    <Typography variant="body2" color="text.disabled" textAlign="center">
                                                        Haz clic en "Ver mensajes" para cargar la conversación
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Input de respuesta */}
                                        {messagesVisible && (
                                            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                                <Stack direction="row" spacing={2} alignItems="flex-end">
                                                    <TextField
                                                        placeholder="Escribe tu respuesta..."
                                                        fullWidth
                                                        size="small"
                                                        multiline
                                                        maxRows={4}
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        disabled={loadingComments}
                                                        variant="outlined"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 1,
                                                            }
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={handleSend}
                                                                        disabled={!replyText.trim() || loadingComments}
                                                                        color="primary"
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                        }}
                                                                    >
                                                                        <SendIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Stack>
                    )}
                </Container>
            </Dialog>
        </>
    );
};

export default ClaimViewModal;