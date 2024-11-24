import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../utils/axios';
import { useNotification } from '../hooks/useNotification';

const Settings = () => {
  const notify = useNotification();
  const [showApiKeys, setShowApiKeys] = useState({
    openai: false,
    google: false,
    moonshot: false,
    baidu: false,
  });
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'zh',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    apiKeys: {
      openai: '',
      google: '',
      moonshot: '',
      baidu: '',
    }
  });

  // 获取当前API密钥设置
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const { data } = await axios.get('/api/v1/users/api-keys');
        setSettings(prev => ({
          ...prev,
          apiKeys: data
        }));
      } catch (error) {
        notify.error('获取API密钥失败');
      }
    };
    fetchApiKeys();
  }, []);

  const handleApiKeyChange = (provider) => (event) => {
    setSettings({
      ...settings,
      apiKeys: {
        ...settings.apiKeys,
        [provider]: event.target.value
      }
    });
  };

  const handleToggleShowApiKey = (provider) => {
    setShowApiKeys({
      ...showApiKeys,
      [provider]: !showApiKeys[provider]
    });
  };

  const handleSaveApiKeys = async () => {
    try {
      await axios.post('/api/v1/users/api-keys', settings.apiKeys);
      notify.success('API密钥保存成功');
    } catch (error) {
      notify.error('保存API密钥失败');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        设置
      </Typography>

      {/* API密钥设置 */}
      <Grid item xs={12}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              API密钥设置
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="OpenAI API Key"
                  value={settings.apiKeys.openai}
                  onChange={handleApiKeyChange('openai')}
                  type={showApiKeys.openai ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleToggleShowApiKey('openai')}>
                          {showApiKeys.openai ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Google API Key"
                  value={settings.apiKeys.google}
                  onChange={handleApiKeyChange('google')}
                  type={showApiKeys.google ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleToggleShowApiKey('google')}>
                          {showApiKeys.google ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Moonshot API Key"
                  value={settings.apiKeys.moonshot}
                  onChange={handleApiKeyChange('moonshot')}
                  type={showApiKeys.moonshot ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleToggleShowApiKey('moonshot')}>
                          {showApiKeys.moonshot ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="百度文心一言 Access Token"
                  value={settings.apiKeys.baidu}
                  onChange={handleApiKeyChange('baidu')}
                  type={showApiKeys.baidu ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleToggleShowApiKey('baidu')}>
                          {showApiKeys.baidu ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              onClick={handleSaveApiKeys}
              sx={{ mt: 2 }}
            >
              保存API密钥
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* 其他设置部分保持不变 */}
    </Container>
  );
};

export default Settings; 